import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TextInput,
  StyleSheet,
  Button,
} from "react-native";
import EasyButton from "../../../Shared/StyledComponents/EasyButton";
import baseURL from "../../../assets/common/baseUrl";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { add } from "react-native-reanimated";

var { width } = Dimensions.get("window");

const Item = ({ item, navigation }) => {
  return (
    <View style={styles.item}>
      <View>
        <Text> Name: {item.name}</Text>
        <Text> Email: {item.email}</Text>
        
      </View>
      {/* <View style={{ flexDirection: 'row' }}>
                <EasyButton
                    primary
                    medium
                    onPress={() => props.navigation.navigate('UpdateProductForm', { productId: props.item._id })}
                    style={{ marginRight: 10 }}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>Update</Text>
                </EasyButton>
                <EasyButton
                    danger
                    medium
                    onPress={() => props.delete(props.item._id)}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
                </EasyButton>
            </View> */}
      <EasyButton
        primary
        medium
        onPress={() =>
          navigation.navigate("UpdateUser", { userId: item._id })
        }
        style={{ marginRight: 10 }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Update</Text>
      </EasyButton>
    </View>
  );
};

const UserList = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  // const [products, setProduct] = useState([]);
  // const [brandName, setBrandName] = useState();
  // const [brandLocation, setBrandLocation] = useState();
  const [token, setToken] = useState();

  useEffect(() => {
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    axios
      .get(`${baseURL}/users`)
      .then((res) => setUsers(res.data))
      .catch((error) => alert("Error load users"));

    return () => {
      setUsers();
      setToken();
    };
  }, []);

  // const addBrand = () => {
  //     const brand = {
  //         name: brandName,
  //         location: brandLocation
  //     };

  //     const config = {
  //         headers: {
  //             Authorization: `Bearer ${token}`,
  //         }
  //     };

  //     axios
  //         .post(`${baseURL}/brands/create`, brand, config)
  //         .then((res) => setBrands([...brands, res.data]))
  //         .catch((error) => alert("Error to load brands"));

  //     setBrandName("")
  //     setBrandLocation("");
  // }

  // const deleteUsers= (id) => {
  //     const config = {
  //         headers: {
  //             Authorization: `Bearer ${token}`,
  //         }
  //     };

  //     axios
  //         .delete(`${baseURL}/users/${id}`, config)
  //         .then((res) => {
  //             const newUsers = users.filter((item) => item.id !== id);
  //             setUsers(newUsers);
  //         })
  //         .catch((error) => alert("Error delete Users"));
  // }

  return (
    <View style={{ position: "relative", height: "100%" }}>
      <View style={{ marginBottom: 60 }}>
        <FlatList
          data={users}
          renderItem={({ item, index }) => (
            <Item item={item} index={index} navigation={navigation} />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={styles.bottomBar}>
        {/* <Text>Name</Text>
                <TextInput
                    value={brandName}
                    style={styles.input}
                    onChangeText={(text) => setBrandName(text)}
                    placeholder="Brand Name"
                />
                <Text>Location</Text>
                <TextInput
                    value={brandLocation}
                    style={styles.input}
                    onChangeText={(text) => setBrandLocation(text)}
                    placeholder="Location"
                />
                <EasyButton
                    medium
                    primary
                    onPress={() => addBrand()}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>Submit</Text>
                </EasyButton> */}
        {/* <Button title="ADD" onPress={() => navigation.navigate('ProductForm')} /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: "white",
    width: width,
    height: 60,
    padding: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
  },
  item: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
    padding: 5,
    margin: 5,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 5,
  },
});

export default UserList;
