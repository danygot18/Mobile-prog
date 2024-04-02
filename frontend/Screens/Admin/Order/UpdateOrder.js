import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import AsyncStorage from '@react-native-async-storage/async-storage';
import EasyButton from "../../../Shared/StyledComponents/EasyButton";
import RNPickerSelect from 'react-native-picker-select';
import { setFormData } from "../../../utils/formData";

const UpdateOrder = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrders] = useState({});
  const [status, setStatus] = useState("");
  const [token, setToken] = useState("");

console.log({ orderId })
useEffect(() => {
    console.log("Fetching order details...");
    
    AsyncStorage.getItem("jwt")
      .then((res) => {
        console.log("Token:", res);
        setToken(res);
      })
      .catch((error) => console.log("Error fetching token:", error));
  
    axios
      .get(`${baseURL}/orders/${orderId}`)
      .then((res) => {
        console.log("Order details:", res.data);
        setOrders(res.data.order)
        setStatus(res.data.order.orderStatus);
        console.log(res.data.order.orderStatus)
      })
      .catch((error) => console.log("Error fetching order details:", error));
  
    return () => {
      console.log("Cleanup");
      setOrders({})

      setToken("");
    };
  }, []);
  const handleUpdateOrder = async () => {
    const updateOrder = {
      orderStatus: status
    };
    const formData = await setFormData(updateOrder);

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    };

    axios
      .put(`${baseURL}/orders/${orderId}`, formData, config)
      .then((res) => {
        navigation.navigate("AdminOrderList");
      })
      .catch((error) => console.log(error.response));
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <RNPickerSelect
        style={pickerSelectStyles}
        onValueChange={(value) => setStatus(value)}
        items={[
          { label: 'Processing', value: 'Processing' },
          { label: 'Confirmed', value: 'Confirmed' },
          { label: 'Shipped', value: 'Shipped' },
          { label: 'Delivered', value: 'Delivered' }
        ]}
        value={status}
      />
      <EasyButton
        primary
        medium
        onPress={handleUpdateOrder}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Update Status</Text>
      </EasyButton>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10,
    width: 200,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10,
    width: 200,
  },
});

export default UpdateOrder;
