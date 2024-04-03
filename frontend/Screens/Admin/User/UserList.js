import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
} from "react-native";
import EasyButton from "../../../Shared/StyledComponents/EasyButton";
import baseURL from "../../../assets/common/baseUrl";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

var { width } = Dimensions.get("window");

const Item = ({ item, navigation, deleteUser }) => {
  return (
    <View style={styles.item}>
      <View>
        <Text> Name: {item.name.substring(0,11)}</Text>
        <Text> Email: {item.email.substring(0,11)}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
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
        <EasyButton
          danger
          medium
          onPress={() => deleteUser(item._id)}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
        </EasyButton>
      </View>
    </View>
  );
};

const UserList = ({ navigation }) => {
  const [users, setUsers] = useState([]);
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
      .catch((error) => alert("Error loading users"));

    return () => {
      setUsers([]);
      setToken("");
    };
  }, []);

  const deleteUser = (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    axios
      .delete(`${baseURL}/users/${id}`, config)
      .then((res) => {
        const newUsers = users.filter((item) => item._id !== id);
        setUsers(newUsers);
      })
      .catch((error) => alert("Error deleting user"));
  };

  return (
    <View style={{ position: "relative", height: "100%" }}>
      <View style={{ marginBottom: 60 }}>
        <FlatList
          data={users}
          renderItem={({ item, index }) => (
            <Item item={item} index={index} navigation={navigation} deleteUser={deleteUser} />
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
