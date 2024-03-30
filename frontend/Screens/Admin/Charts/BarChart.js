import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import SyncStorage from "sync-storage";
import { useNavigation } from "@react-navigation/native";
import { BarChart } from "react-native-chart-kit";

const UserPurchaseGraph = () => {
  const [userPurchaseData, setUserPurchaseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserPurchaseData = async () => {
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
        const userPurchaseSummary = processDataForUserPurchases(data.orders);
        setUserPurchaseData(userPurchaseSummary);
      } catch (error) {
        console.error("Error fetching user purchase data:", error);
        alert("Error fetching user purchase data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPurchaseData();
  }, []);

  const processDataForUserPurchases = (orders) => {
    const userPurchases = {};
    orders.forEach((order) => {
      const userName = order.user.name;
      const totalPrice = order.totalPrice;

      if (userPurchases[userName]) {
        userPurchases[userName] += totalPrice;
      } else {
        userPurchases[userName] = totalPrice;
      }
    });

    // Convert userPurchases object to an array of objects
    return Object.entries(userPurchases).map(([userName, totalPurchase]) => ({
      userName,
      totalPurchase,
    }));
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View style={styles.chartContainer}>
          <Text style={styles.title}>User Total Purchases</Text>
          <BarChart
            data={{
              labels: userPurchaseData.map((user) => user.userName),
              datasets: [
                {
                  data: userPurchaseData.map((user) => user.totalPurchase),
                },
              ],
            }}
            width={350}
            height={220}
            yAxisLabel="₱"
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
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
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

export default UserPurchaseGraph;
