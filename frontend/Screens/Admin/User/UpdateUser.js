import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Dimensions,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image
} from "react-native";
import EasyButton from "../../../Shared/StyledComponents/EasyButton";
import baseURL from "../../../assets/common/baseUrl";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { setFormData, setImageUpload } from "../../../utils/formData";
import { FontAwesome } from '@expo/vector-icons';
import FormContainer from "../../../Shared/Form/FormContainer";
import Error from "../../../Shared/Error";
import Input from "../../../Shared/Form/Input";

const { width } = Dimensions.get("window");

const UpdateUser = ({ route, navigation }) => {
    const { userId } = route.params;
    console.log({userId})

    const [user, setUser] = useState({});
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [roles, setRoles] = useState("");
    const [token, setToken] = useState("");
    const [error, setError] = useState();


    useEffect(() => {
        AsyncStorage.getItem("jwt")
            .then((res) => {
                setToken(res);
            })
            .catch((error) => console.log(error));

        axios
            .get(`${baseURL}/users/${userId}`)
            .then((res) => {
                setUser(res.data);
                console.log(res.data)
                setName(res.data.user.name);
                console.log(res.data.user.name)
                setEmail(res.data.user.email);
                setRoles(res.data.user.isAdmin);
            })
            .catch((error) => alert("Error loading User"));

        return () => {
            setUser({});
            setToken("");
        };
    }, []);




    const updateUser = async () => {
        const updatedUser = {
            name: name,
            email: email,
            isAdmin: roles
        };

        const formData = await setFormData(updatedUser);

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            }
        };

        axios
            .put(`${baseURL}/users/${userId}`, formData, config)
            .then((res) => {
                // Handle successful update
                navigation.navigate("UserList");
            })
            .catch((error) => console.log(error.response));
    };

    return (
        // <View style={{ flex: 1 }}>
        //     <Text style={{ marginLeft: 10 }}>Name</Text>
        //     <TextInput
        //         value={name}
        //         style={styles.input}
        //         onChangeText={(text) => setName(text)}
        //         placeholder="Name"
        //     />
        //     <Text style={{ marginLeft: 10 }}>Email</Text>
        //     <TextInput
        //         value={email}
        //         style={styles.input}
        //         onChangeText={(text) => setEmail(text)}
        //         placeholder="Email"
        //     />
        //     <TextInput
        //         value={roles}
        //         style={styles.input}
        //         onChangeText={(text) => setRoles(text)}
        //         placeholder="Email"
        //     />

        
        //     <View style={{ alignItems: "center" }}>
        //         <EasyButton
        //             medium
        //             primary
        //             onPress={updateUser}
        //         >
        //             <Text style={{ color: "white", fontWeight: "bold" }}>Update User</Text>
        //         </EasyButton>
        //     </View>
        // </View>
        <FormContainer title="Update User">
            {error ? <Error message={error} /> : null}
            
            <Input
                placeholder="Name"
                name="name"
                id="name"
                value={name}
                onChangeText={(text) => setName(text)}
            />
            <Input
                placeholder="email"
                name="email"
                id="email"
                value={email}
                keyboardType={"numeric"}
                onChangeText={(text) => setEmail(text)}
            />
            <Input
                placeholder="roles"
                name="roles"
                id="roles"
                value={roles}
                onChangeText={(text) => setRoles(text)}
            />
            
            <View style={styles.buttonContainer}>
                <EasyButton
                    large
                    primary
                    onPress={updateUser}
                >
                    <Text style={styles.buttonText}>Update User</Text>
                </EasyButton>
            </View>
        </FormContainer>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        margin: 9,
        padding: 5,
    },
    buttonContainer: {
        width: "80%",
        marginBottom: 80,
        marginTop: 20,
        alignItems: "center"
    },
    buttonText: {
        color: "white"
    }
});

export default UpdateUser;
