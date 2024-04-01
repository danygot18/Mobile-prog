// profile
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Button, Image, StyleSheet,Alert } from 'react-native';
import { Container } from "native-base"
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios"
import baseURL from "../../assets/common/baseUrl"
import { useFocusEffect } from '@react-navigation/native';
import { getUser } from '../../utils/user';
import SyncStorage from "sync-storage";
import { useDispatch, useSelector } from 'react-redux'
import { logoutAction } from '../../Redux/Actions/userActions'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const UserProfile = ({ navigation }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const dispatch = useDispatch();

    console.log(SyncStorage.get('jwt'))
    const getProfile = async () => {
        
        const token = await SyncStorage.get('jwt');
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
            await SyncStorage.remove('jwt');
            setIsAuthenticated(false);
            dispatch(logoutAction())
            navigation.navigate('Login');
        } catch (error) {
            console.error(error);
        }
    };

    const notifyOrderStatus = async () => {
        try {
            const token = await SyncStorage.get('jwt');
            const config = {
                headers: {
                    Authorization: `${token}`,
                },
            };
            const response = await axios.get(`${baseURL}/orders`, config);
            const orders = response.data.orders;
            const deliveredOrders = orders.filter(order => order.orderStatus === "Delivered");
            if (deliveredOrders.length > 0) {
                let message = "Delivered Orders:\n";
                deliveredOrders.forEach(order => {
                    message += `Order ID: ${order._id}, \nStatus: ${order.orderStatus}\n`;
                });
                Alert.alert('Delivered Orders', message);
            } else {
                Alert.alert('No Delivered Orders', 'You have no orders with status "Delivered".');
            }
        } catch (error) {
            console.error('Error notifying order status:', error);
            Alert.alert('Notification Error', 'Failed to notify order status.');
        }
    };

    return (
        <Container style={styles.container}>
            <ScrollView contentContainerStyle={styles.subContainer}>
                <>
                <MaterialIcons name="notifications" size={30} color="black" onPress={notifyOrderStatus} />
                    <Text style={{ fontSize: 30 }}>{userProfile?.name}</Text>
                    {userProfile && userProfile?.image && (
                        <Image source={{ uri: userProfile.image }} style={styles.image} />
                    )}
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>Email: {userProfile?.email}</Text>
                        <Text style={styles.infoText}>Phone: {userProfile?.phone}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="Logout" onPress={handleLogout} />
                        <Button title="Update" onPress={() => navigation.navigate('UpdateProfile')} />
                        <Button title="Order" onPress={() => navigation.navigate('OrderList')} />
                    </View>
                </>
            </ScrollView>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        
    },
    subContainer: {
        alignItems: "center",
        marginTop: 60,
    },
    name: {
        fontSize: 30,
        marginBottom: 20,
        textAlign: "center",
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginTop: 20,
    },
    infoContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    infoText: {
        marginVertical: 10,
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-around",
        width: "80%",
    },
});

export default UserProfile;
