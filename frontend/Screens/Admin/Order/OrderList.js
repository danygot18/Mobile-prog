import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import SyncStorage from "sync-storage";
import { useNavigation } from "@react-navigation/native";

const Item = ({ item }) => (
  <View style={styles.item}>
    <Text style={styles.name}>Name: {item.user.name}</Text>
    <View style={styles.orderItemsContainer}>
      {item.orderItems.map((orderItem) => (
        <View key={orderItem._id} style={styles.orderItem}>
          <Text>Product: {orderItem.name}</Text>
          <Text>Price: {orderItem.price}</Text>
          <Text>Quantity: {orderItem.quantity}</Text>
        </View>
      ))}
    </View>
    <Text style={styles.total}>Total: ${item.totalPrice}</Text>
    <Text style={styles.orderStatus}>Order Status: {item.orderStatus}</Text>
    <Text style={styles.shippingInfo}>Shipping Address: {item.shippingInfo.address}</Text>
    <Text style={styles.shippingInfo}>City: {item.shippingInfo.city}</Text>
    <Text style={styles.shippingInfo}>Country: {item.shippingInfo.country}</Text>
    <Text style={styles.shippingInfo}>Phone Number: {item.shippingInfo.phoneNo}</Text>
    <Text style={styles.shippingInfo}>Postal Code: {item.shippingInfo.postalCode}</Text>
  </View>
);

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrders = async () => {
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
        setOrders(data.orders);
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
    <View style={{ flex: 1 }}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderItemsContainer: {
    marginBottom: 10,
  },
  orderItem: {
    marginBottom: 5,
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderStatus: {
    fontSize: 16,
    marginBottom: 5,
    color: "blue",
  },
  shippingInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default AdminOrderList;
