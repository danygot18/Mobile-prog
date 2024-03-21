import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';
import Input from "../../Shared/Form/Input";
import FormContainer from "../../Shared/Form/FormContainer";
import { Button } from "native-base";
import { useNavigation } from '@react-navigation/native';
import Error from '../../Shared/Error';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import baseURL from "../../assets/common/baseUrl";
import Toast from 'react-native-toast-message';
import { authenticate, getToken, getUser } from '../../utils/user';

const Login = ({ navigation }) => {
//   const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async (values) => {
    try {

        const { data } = await axios.post(`${baseURL}/users/login`, values);

        Toast.show({
            topOffset: 60,
            type: "success",
            text1: data.message,
        });

        authenticate(data)
        // setLoader(false)

        navigation.navigate('UserProfile');

    } catch (err) {
        console.log(err)
        // setLoader(false)
        Toast.show({
            position: 'bottom',
            bottomOffset: 20,
            type: "error",
            text1: err?.response?.data?.message || 'Please try again later',
        });
    }
    
}

const handleSubmit = () => {
    const values = {email:email,password:password}; 
    login(values);
}

  return (
    <FormContainer>
      <Input
        placeholder={"Enter email"}
        name={"email"}
        id={"email"}
        value={email}
        onChangeText={(text) => setEmail(text.toLowerCase())}
      />
      <Input
        placeholder={"Enter Password"}
        name={"password"}
        id={"password"}
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <View style={styles.buttonGroup}>
        {error ? <Error message={error} /> : null}
        <Button
          large
          primary
          onPress={() => handleSubmit()}
        >
          <Text style={{ color: "white" }}>Login</Text>
        </Button>
      </View>
      <View style={[{ marginTop: 40 }, styles.buttonGroup]}>
        <Text style={styles.middleText}>Don't Have an Account yet?</Text>
        <Button
          large
          secondary
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={{ color: "white" }}>Register</Text>
        </Button>
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "80%",
    alignItems: "center",
  },
  middleText: {
    marginBottom: 20,
    alignSelf: "center",
  },
});

export default Login;
