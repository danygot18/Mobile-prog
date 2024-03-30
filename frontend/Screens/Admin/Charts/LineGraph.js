import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import SyncStorage from "sync-storage";
import { useNavigation } from "@react-navigation/native";
import { LineChart } from "react-native-chart-kit";

const LineGraph = () => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const token = await SyncStorage.get("jwt");
                if (!token) {
                    navigation.navigate("Login");
                    return;
                }
                const config = {
                    headers: {
                        Authorization: `${token}`,
                    },
                };
                const { data } = await axios.get(`${baseURL}/orders/admin`, config);

                const salesData = processDataForSalesPerMonth(data.orders);
                setSalesData(salesData);
            } catch (error) {
                console.error("Error fetching sales data:", error);
                alert("Error fetching sales data");
            } finally {
                setLoading(false);
            }
        };

        fetchSalesData();
    }, []);

    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const processDataForSalesPerMonth = (orders) => {
        const salesData = {};

        // Sum up the total sales for each month
        orders.forEach((order) => {
            const month = new Date(order.createdAt).getMonth(); // Get month index (0-11)
            const year = new Date(order.createdAt).getFullYear(); // Get year
            const monthName = `${monthNames[month]} ${year.toString().slice(-2)}`; // Last 2 digits of year
            const totalPrice = order.totalPrice;

            if (salesData[monthName]) {
                salesData[monthName] += totalPrice; // Add totalPrice to existing month-year key
            } else {
                salesData[monthName] = totalPrice; // Create new entry for month-year key
            }
        });

        // Convert salesData object to an array of objects
        const sortedSalesData = Object.entries(salesData)
            .sort(([monthYear1], [monthYear2]) => {
                const [month1, year1] = monthYear1.split(" ");
                const [month2, year2] = monthYear2.split(" ");
                // Compare years first
                if (year1 !== year2) {
                    return parseInt(year1) - parseInt(year2);
                } else {
                    // If years are the same, compare months
                    return monthNames.indexOf(month1) - monthNames.indexOf(month2);
                }
            })
            .map(([monthYear, totalSales]) => ({ month: monthYear, totalSales }));

        return sortedSalesData;
    };

    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <View style={styles.chartContainer}>
                    <Text style={styles.title}>Sales Per Month</Text>
                    <LineChart
                        data={{
                            labels: salesData.map((data) => data.month),
                            datasets: [
                                {
                                    data: salesData.map((data) => data.totalSales),
                                },
                            ],
                        }}
                        width={350}
                        height={220}
                        yAxisLabel="€"
                        chartConfig={{
                            backgroundColor: "#fff",
                            backgroundGradientFrom: "#fff",
                            backgroundGradientTo: "#fff",
                            decimalPlaces: 2,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            minValue: Math.min(...salesData.map((data) => data.totalSales)), // Start from the lowest value
                        }}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    chartContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
});

export default LineGraph;
