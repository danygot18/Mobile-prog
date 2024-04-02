import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import Input from "../../Shared/Form/Input";
import FormContainer from "../../Shared/Form/FormContainer";
import { Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import Error from "../../Shared/Error";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import { authenticate, getToken, getUser } from "../../utils/user";
import SyncStorage from "sync-storage";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, loginAction } from "../../Redux/Actions/userActions";

const Login = ({ navigation }) => {
  //   const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const login = async (values) => {
    try {
      const { data } = await axios.post(`${baseURL}/users/login`, values);
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: data.message,
      });
      // authenticate(data)
      console.log(data);
      // setLoader(false)
      SyncStorage.set("jwt", data.token);
      SyncStorage.set("user", JSON.stringify(data.user));

      navigation.navigate("UserProfile");
    } catch (err) {
      console.log(err);
      // setLoader(false)
      Alert.alert("Login Error", "Wrong username and password");
      Toast.show({
        position: "bottom",
        bottomOffset: 20,
        type: "error",
        text1: err?.response?.data?.message || "Please try again later",
      });
    }
  };

  const handleSubmit = () => {
    const values = { email: email, password: password };
    login(values);
    dispatch(loginAction(values));
  };

  return (
    <FormContainer>
      <Input
        placeholder="Enter email"
        value={email}
        onChangeText={(text) => setEmail(text.toLowerCase())}
      />
      <Input
        placeholder="Enter Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      {error && <Error message={error} />}
      <Button large primary onPress={handleSubmit}>
        <Text style={{ color: "white" }}>Login</Text>
      </Button>
      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text>Don't Have an Account yet?</Text>
        <Button large secondary onPress={() => navigation.navigate("Register")}>
          <Text style={{ color: "white" }}>Register</Text>
        </Button>
      </View>
    </FormContainer>
  );
};

export default Login;
