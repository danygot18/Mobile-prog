import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import BarGraph from "./BarChart";
import PieChart from "./PieChart";
import LineGraph from "./LineGraph";

const AdminCharts = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.chartContainer}>
                <LineGraph />
            </View>
            <View style={styles.chartContainer}>
                <PieChart />
            </View>
            <View style={styles.chartContainer}>
                <BarGraph />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingVertical: 20,
    },
    chartContainer: {
        marginBottom: 20,
    },
});

export default AdminCharts;
