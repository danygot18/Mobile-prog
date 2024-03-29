import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, ScrollView, Button } from "react-native";
import { Text, HStack, VStack, Avatar, Spacer, Center } from "native-base";

import { clearCart } from "../../../Redux/Actions/cartActions";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import SyncStorage from "sync-storage";

var { width, height } = Dimensions.get("window");

const Confirm = (props) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const finalOrder = props.route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserAndToken = () => {
      try {
        const userData = SyncStorage.get('user');
        const jwtToken = SyncStorage.get('jwt');
        console.log(jwtToken)
        if (userData && jwtToken) {
          setUser(JSON.parse(userData));
          setToken(jwtToken);
        } else {
          console.error("User data or token not found.");
        }
      } catch (error) {
        console.error("Error fetching user data or token:", error);
      }
    };

    fetchUserAndToken();
  }, []);

  const confirmOrder = async () => {
    try {
      if (!user || !token) {
        console.error("User or token is not available");
        return;
      }

      const order = finalOrder.order.order;
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };

      const response = await axios.post(`${baseURL}/orders`, order, config);

      if (response.status === 200 || response.status === 201) {
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Order Completed",
          text2: "",
        });
        setTimeout(() => {
          dispatch(clearCart());
          navigation.navigate("Cart");
        }, 500);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again",
      });
    }
  };

  return (
    <Center>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Confirm Order
          </Text>
          {finalOrder && finalOrder.order ? (
            <View style={{ borderWidth: 1, borderColor: "orange" }}>
              <Text style={styles.title}>Shipping to:</Text>
              <View style={{ padding: 8 }}>
                <Text>Address: {finalOrder.order.order.address}</Text>
                <Text>Phone #: {finalOrder.order.order.phoneNo}</Text>
                <Text>City: {finalOrder.order.order.city}</Text>
                <Text>Zip Code: {finalOrder.order.order.postalCode}</Text>
                <Text>Country: {finalOrder.order.order.country}</Text>
              </View>
              <Text style={styles.title}>Items</Text>
              {finalOrder.order.order.orderItems.map((item) => (
                <HStack
                  space={[2, 3]}
                  justifyContent="space-between"
                  key={item.id}
                >
                  <Avatar
                    size="48px"
                    source={{
                      uri: item.images[0]
                        ? item.images[0]
                        : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
                    }}
                  />
                  <VStack>
                    <Text
                      _dark={{ color: "warmGray.50" }}
                      color="coolGray.800"
                      bold
                    >
                      {item.name}
                    </Text>
                  </VStack>
                  <Spacer />
                  <Text
                    fontSize="xs"
                    _dark={{ color: "warmGray.50" }}
                    color="coolGray.800"
                    alignSelf="flex-start"
                  >
                    {item.price}
                  </Text>
                </HStack>
              ))}
            </View>
          ) : null}
          <View style={{ alignItems: "center", margin: 20 }}>
            <Button title={"Place order"} onPress={confirmOrder} />
          </View>
        </View>
      </ScrollView>
    </Center>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height,
    padding: 8,
    alignContent: "center",
    backgroundColor: "white",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  title: {
    alignSelf: "center",
    margin: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Confirm;