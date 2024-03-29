import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import SyncStorage from "sync-storage";
import { useNavigation } from "@react-navigation/native";

const Item = ({ item }) => (
  <View style={styles.item}>
    <View>
      <Text>Name: {item.name}</Text>
      <Text>Email: {item.email}</Text>
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
        const token = await SyncStorage.get("jwt"); // Corrected usage of SyncStorage
        if (!token) {
          // Handle the case when the user is not authenticated
          navigation.navigate("Login");
          return;
        }
        const config = {
          headers: {
            Authorization: `${token}`,
          },
        };
        const { data }= await axios.get(`${baseURL}/orders`, config);
        console.log(data)
        setOrders(data.order);
      } catch (error) {
        // Handle errors more gracefully, perhaps by showing an error message to the user
        console.error("Error fetching orders:", error);
        // Alert the user about the error
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
});

export default OrderList;
