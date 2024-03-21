import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import { Container } from "native-base"
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios"
import baseURL from "../../assets/common/baseUrl"
// import { useFocus } from 'native-base/lib/typescript/components/primitives';
import { useFocusEffect} from '@react-navigation/native';

const UserProfile = ({ navigation }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);



    const getProfile = async () => {
        const token = await AsyncStorage.getItem('jwt');
        console.log(token)
        if (!token) {
            setIsAuthenticated(false);
            navigation.navigate('Login');
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
            console.log(data + '39')
        } catch (error) {
            console.error(error);
            setIsAuthenticated(false); // Set authentication to false if there's an error
            navigation.navigate('Login'); // Navigate to login page on error
        } finally {
            setLoading(false); // Ensure loading is set to false after request completes (success or error)
        }
    };
    console.log(userProfile)

    // useEffect(() => {

    //     setIsAuthenticated(true);
    //     setLoading(false);
    //     getProfile();
    //     // setIsAuthenticated(false);
    //     // navigation.navigate('Login'); // Navigate to login screen if not authenticated   
    // }, [userProfile]);

    useFocusEffect(
        useCallback(() => {
            setIsAuthenticated(true);
            setLoading(false);
            getProfile();
        }, [])
    )


    return (
        <Container style={styles.container}>
            <ScrollView contentContainerStyle={styles.subContainer}>

                <>
                    <Text style={{ fontSize: 30 }}>{userProfile?.name}</Text>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ margin: 10 }}>Email: {userProfile?.email}</Text>
                        <Text style={{ margin: 10 }}>Phone: {userProfile?.phone}</Text>
                    </View>
                </>

            </ScrollView>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    subContainer: {
        alignItems: "center",
        marginTop: 60
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default UserProfile;
