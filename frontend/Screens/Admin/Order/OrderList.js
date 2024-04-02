import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EasyButton from "../../../Shared/StyledComponents/EasyButton";
import SyncStorage from "sync-storage";


const Item = ({ item, navigation }) => (
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
    <Text style={styles.shippingInfo}>
      Shipping Address: {item.shippingInfo.address}
    </Text>
    <Text style={styles.shippingInfo}>City: {item.shippingInfo.city}</Text>
    <Text style={styles.shippingInfo}>
      Country: {item.shippingInfo.country}
    </Text>
    <Text style={styles.shippingInfo}>
      Phone Number: {item.shippingInfo.phoneNo}
    </Text>
    <Text style={styles.shippingInfo}>
      Postal Code: {item.shippingInfo.postalCode}
    </Text>

    <EasyButton
      primary
      medium
      onPress={() => navigation.navigate("UpdateOrder", { orderId: item._id })}
      style={{ marginRight: 10 }}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>Update</Text>
    </EasyButton>
  </View>
);

const AdminOrderList = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState();

  // useEffect(() => {
  //   AsyncStorage.getItem("jwt")
  //     .then((res) => {
  //       setToken(res);
  //     })
  //     .catch((error) => console.log(error));

  //   axios
  //     .get(`${baseURL}/orders/admin`)
      
  //     .then((res) => setOrders(res.data))
      
  //     .catch((error) => alert("Error load Orders"));

  //   return () => {
      
  //     setOrders();
  //     console.log(setOrders())
  //     setToken();
  //   };
  // }, []);
  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        if (!token) {
          navigation.navigate("Login");
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
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
          renderItem={({ item, index }) => (
            <Item item={item} index={index} navigation={navigation} />
          )}
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
