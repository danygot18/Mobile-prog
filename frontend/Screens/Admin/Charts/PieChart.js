import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import SyncStorage from "sync-storage";
import { useNavigation } from "@react-navigation/native";

const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

const OrderedProductsList = () => {
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrderedProducts = async () => {
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
        const products = extractOrderedProducts(data.orders);
        setOrderedProducts(products);
      } catch (error) {
        console.error("Error fetching ordered products:", error);
        alert("Error fetching ordered products");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderedProducts();
  }, []);

  const extractOrderedProducts = (orders) => {
    const products = {};
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const { name, quantity } = item;
        if (products[name]) {
          products[name] += quantity;
        } else {
          products[name] = quantity;
        }
      });
    });

    // Convert products object to an array of objects
    return Object.entries(products).map(([name, quantity]) => ({ name, quantity }));
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <Text>Loading...</Text>
      ) : orderedProducts.length > 0 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Ordered Products</Text>
          <PieChart
            data={orderedProducts.map((product) => ({
              name: product.name,
              quantity: product.quantity,
              color: getRandomColor(),
              legendFontColor: "#7F7F7F",
              legendFontSize: 15,
            }))}
            width={350}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            accessor="quantity"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      ) : (
        <Text>No data available</Text>
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

export default OrderedProductsList;
