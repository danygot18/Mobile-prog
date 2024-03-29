import React, { useEffect, useState, useContext } from "react";
import { Text, View, Button } from "react-native";
import { Select, Item, Picker, Toast } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import FormContainer from "../../../Shared/Form/FormContainer";
import Input from "../../../Shared/Form/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AuthGlobal from "../../../Context/Store/AuthGlobal";
import SyncStorage from "sync-storage";

const countries = require("../../../assets/countries.json");

const Checkout = (props) => {
  const [user, setUser] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNo, setPhone] = useState("");

  const navigation = useNavigation();
  const cartItems = useSelector((state) => state.cartItems);
  const context = useContext(AuthGlobal);

  useEffect(() => {
    setOrderItems(cartItems);
    const userData = SyncStorage.get("user");
    if (userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj._id); // Ensure to access _id property for user ID
    }
  }, []);

  const checkOut = () => {
    console.log("orders", orderItems);
    let order = {
      city,
      country,
      dateOrdered: Date.now(),
      orderItems,
      phoneNo,
      address,
      status: "3",
      user,
      postalCode,
    };
    console.log("ship", order);
    navigation.navigate("Payment", { order: order });
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <FormContainer title={"Shipping Address"}>
        <Input
          placeholder={"Phone"}
          name={"phone"}
          value={phoneNo}
          keyboardType={"numeric"}
          onChangeText={(text) => setPhone(text)}
        />
        <Input
          placeholder={"Shipping Address"}
          name={"ShippingAddress"}
          value={address}
          onChangeText={(text) => setAddress(text)}
        />
        <Input
          placeholder={"City"}
          name={"city"}
          value={city}
          onChangeText={(text) => setCity(text)}
        />
        <Input
          placeholder={"Zip Code"}
          name={"zip"}
          value={postalCode}
          keyboardType={"numeric"}
          onChangeText={(text) => setZip(text)}
        />
        <Select
          width="80%"
          iosIcon={<Icon name="arrow-down" color={"#007aff"} />}
          style={{ width: undefined }}
          selectedValue={country}
          placeholder="Select your country"
          placeholderStyle={{ color: "#007aff" }}
          placeholderIconColor="#007aff"
          onValueChange={(e) => setCountry(e)}
        >
          {countries.map((c) => {
            return <Select.Item key={c.code} label={c.name} value={c.name} />;
          })}
        </Select>

        <View style={{ width: "80%", alignItems: "center" }}>
          <Button title="Confirm" onPress={() => checkOut()} />
        </View>
      </FormContainer>
    </KeyboardAwareScrollView>
  );
};
export default Checkout;
