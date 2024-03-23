import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Button, Image, StyleSheet } from 'react-native';
import { Container } from "native-base"
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios"
import baseURL from "../../assets/common/baseUrl"
import { useFocusEffect } from '@react-navigation/native';

const UserProfile = ({ navigation }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const getProfile = async () => {
        const token = await AsyncStorage.getItem('jwt');
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
        } catch (error) {
            console.error(error);
            setIsAuthenticated(false);
            navigation.navigate('Login');
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
            await AsyncStorage.removeItem('jwt');
            setIsAuthenticated(false);
            navigation.navigate('Login');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container style={styles.container}>
            <ScrollView contentContainerStyle={styles.subContainer}>
                <>
                    <Text style={{ fontSize: 30 }}>{userProfile?.name}</Text>
                    {userProfile && userProfile?.image && (
                        <Image source={{ uri: userProfile.image }} style={styles.image} />

                    )}
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ margin: 10 }}>Email: {userProfile?.email}</Text>
                        <Text style={{ margin: 10 }}>Phone: {userProfile?.phone}</Text>
                    </View>
                    <Button title="Logout" onPress={handleLogout} />
                    <Button title= "Update" onPress= {() => navigation.navigate('UpdateProfile')} />
                    
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
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginTop: 20,
    },
});

export default UserProfile;
