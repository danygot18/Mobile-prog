import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import { Container } from "native-base"
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios"
import baseURL from "../../assets/common/baseUrl"

const UserProfile = ({ navigation }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = await AsyncStorage.getItem('jwt');
            if (token) {
                setIsAuthenticated(true);
                getProfile(token);
            } else {
                setIsAuthenticated(false);
                navigation.navigate('Login'); // Navigate to login screen if not authenticated
            }
        };
        checkAuthentication();
    }, []);

    const getProfile = async (token) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`${baseURL}/users/profile`, config);
            setUserProfile(data.user);
            setLoading(false);
        } catch (error) {
            console.error(error);
            // Handle error, such as token expired or invalid
            // Redirect to login page or show error message
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <Container style={styles.container}>
            <ScrollView contentContainerStyle={styles.subContainer}>
                {isAuthenticated && userProfile && (
                    <>
                        <Text style={{ fontSize: 30 }}>{userProfile.name}</Text>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ margin: 10 }}>Email: {userProfile.email}</Text>
                            <Text style={{ margin: 10 }}>Phone: {userProfile.phone}</Text>
                        </View>
                    </>
                )}
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
