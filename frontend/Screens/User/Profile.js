// profile
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { Container } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { useFocusEffect } from "@react-navigation/native";
import { getUser } from "../../utils/user";
import SyncStorage from "sync-storage";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../../Redux/Actions/userActions";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FormContainer from "../../Shared/Form/FormContainer";

const UserProfile = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();

  console.log(SyncStorage.get("jwt"));
  const getProfile = async () => {
    const token = await SyncStorage.get("jwt");
    if (!token) {
      setIsAuthenticated(false);
      navigation.navigate("Login");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };
      const { data } = await axios.get(`${baseURL}/users/profile`, config);
      setLoading(false);
      setUserProfile(data.user);
    } catch (error) {
      console.error(error);
      setIsAuthenticated(false);
      navigation.navigate("Login");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsAuthenticated(true);
      setLoading(false);
      getProfile();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await SyncStorage.remove("jwt");
      setIsAuthenticated(false);
      dispatch(logoutAction());
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
    }
  };

  const notifyOrderStatus = async () => {
    try {
      const token = await SyncStorage.get("jwt");
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };
      const response = await axios.get(`${baseURL}/orders`, config);
      const orders = response.data.orders;
      const deliveredOrders = orders.filter(
        (order) => order.orderStatus === "Delivered"
      );
      if (deliveredOrders.length > 0) {
        let message = "Delivered Orders:\n";
        deliveredOrders.forEach((order) => {
          message += `Order ID: ${order._id}, \nStatus: ${order.orderStatus}\n`;
        });
        Alert.alert("Delivered Orders", message);
      } else {
        Alert.alert(
          "No Delivered Orders",
          'You have no orders with status "Delivered".'
        );
      }
    } catch (error) {
      console.error("Error notifying order status:", error);
      Alert.alert("Notification Error", "Failed to notify order status.");
    }
  };

  return (
    <FormContainer
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        color: "black",
      }}
    >
      <ScrollView
        contentContainerStyle={{ alignItems: "center", marginTop: 0 }}
      >
        <>
          {/* <MaterialIcons name="local-shipping" size={30} color="black" onPress={notifyOrderStatus} /> */}
          <Text
            style={{
              fontSize: 30,
              fontFamily: "Roboto",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            {userProfile?.name}
          </Text>
          {userProfile?.image && (
            <Image
              source={{ uri: userProfile.image }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                marginTop: 20,
              }}
            />
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
              justifyContent: "flex-start",
            }}
          >
            <MaterialIcons name="email" size={24} color="#333" />
            <Text
              style={{
                marginLeft: 10,
                fontFamily: "Roboto",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              {userProfile?.email}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
              justifyContent: "flex-start",
            }}
          >
            <MaterialIcons name="phone" size={24} color="#333" />
            <Text
              style={{
                marginLeft: 10,
                fontFamily: "Roboto",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              {userProfile?.phone}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              width: "90%",
              marginBottom: 20,
            }}
          >
            <View>
              <Button
                title="Logout"
                onPress={handleLogout}
                style={{ backgroundColor: "black" }}
              />
            </View>
            <View>
              <Button
                title="Update"
                onPress={() => navigation.navigate("UpdateProfile")}
                style={{ backgroundColor: "black" }}
              />
            </View>
            <View>
              <Button
                title="Order"
                onPress={() => navigation.navigate("OrderList")}
                style={{ backgroundColor: "black" }}
              />
            </View>
          </View>
        </>
      </ScrollView>
    </FormContainer>
  );
};

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",

//     },
//     subContainer: {
//         alignItems: "center",
//         marginTop: 60,
//     },
//     name: {
//         fontSize: 30,
//         marginBottom: 20,
//         textAlign: "center",
//     },
//     image: {
//         width: 200,
//         height: 200,
//         borderRadius: 100,
//         marginTop: 20,
//     },
//     infoContainer: {
//         marginTop: 20,
//         alignItems: "center",
//     },
//     infoText: {
//         marginVertical: 10,
//     },
//     buttonContainer: {
//         marginTop: 20,
//         flexDirection: "row",
//         justifyContent: "space-around",
//         width: "80%",
//     },
// });

export default UserProfile;
