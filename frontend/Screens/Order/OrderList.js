import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import SyncStorage from "sync-storage";
import { useNavigation } from "@react-navigation/native";

const Item = ({ item }) => (
  <View style={styles.item}>
    <View style={styles.orderDetails}>
      <Text style={styles.header}>Order Details</Text>
      {item.orderItems.map((orderItem) => (
        <View key={orderItem._id} style={styles.orderItem}>
          <Text>Product: {orderItem.name}</Text>
          <Text>Price: {orderItem.price}</Text>
          <Text>Quantity: {orderItem.quantity}</Text>
        </View>
      ))}
      <Text style={styles.orderStatus}>Order Status: {item.orderStatus}</Text>
      <Text>Shipping Address: {item.shippingInfo.address}</Text>
      <Text>City: {item.shippingInfo.city}</Text>
      <Text>Country: {item.shippingInfo.country}</Text>
      <Text>Phone Number: {item.shippingInfo.phoneNo}</Text>
      <Text>Postal Code: {item.shippingInfo.postalCode}</Text>
      <Text style={styles.total}>Total: ${item.totalPrice}</Text>
    </View>
  </View>
);

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = SyncStorage.get("jwt");
        if (!token) {
          navigation.navigate("Login");
          return;
        }
        const config = {
          headers: {
            Authorization: `${token}`,
          },
        };
        const response = await axios.get(`${baseURL}/orders`, config);
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={orders}
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={(item) => item._id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  orderDetails: {
    alignItems: "flex-start",
  },
  header: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  orderStatus: {
    fontSize: 16,
    marginBottom: 5,
    color: "blue",
  },
  total: {
    fontSize: 15,
    marginBottom: 5,
    color: "red",
  },
  orderItem: {
    marginBottom: 5,
  },
});

export default OrderList;
