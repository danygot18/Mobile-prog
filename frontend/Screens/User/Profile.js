import React, { useContext, useState, useCallback } from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import { Container } from "native-base"
import { useFocusEffect, useNavigation } from "@react-navigation/native"

import AsyncStorage from '@react-native-async-storage/async-storage'

import axios from "axios"
import baseURL from "../../assets/common/baseUrl"


// import OrderCard from '../../Shared/OrderCard';
import { authenticate, getToken, getUser } from '../../utils/user';

const UserProfile = (props) => {
  
    const [userProfile, setUserProfile] = useState('')
    const [loading, setLoading] = useState(true);
    // const [orders, setOrders] = useState([])
    const navigation = useNavigation()

    const getProfile = async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        };
        try {
            const { data } = await axios.get(
              `${baseURL}/users/profile`,
              config
            );
            console.log(data);
            setUserProfile(data.user);
            setLoading(false);
          } catch (error) {
            console.error(error);
            toast.error("Failed to fetch user profile", {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        };
    useEffect(() => {
        getProfile();
      }, []);


    // useFocusEffect(
    //     useCallback(() => {
    //         if (
    //             context.stateUser.isAuthenticated === false ||
    //             context.stateUser.isAuthenticated === null
    //         ) {
    //             navigation.navigate("Login")
    //         }
    //         // console.log(context.stateUser.user)
    //         AsyncStorage.getItem("jwt")
    //             .then((res) => {
    //                 axios
    //                     .get(`${baseURL}users/${context.stateUser.user.userId}`, {
    //                         headers: { Authorization: `Bearer ${res}` },
    //                     })
    //                     .then((user) => setUserProfile(user.data))
    //             })
    //             .catch((error) => console.log(error))
    //         axios
    //             .get(`${baseURL}orders`)
    //             .then((x) => {
    //                 const data = x.data;
    //                 console.log(data)
    //                 const userOrders = data.filter(
    //                     (order) =>
    //                         // console.log(order)
    //                         order.user ? (order.user._id === context.stateUser.user.userId) : false

    //                 );
    //                 setOrders(userOrders);
    //             })
    //             .catch((error) => console.log(error))
    //         return () => {
    //             setUserProfile();
    //         }

    //     }, [context.stateUser.isAuthenticated]))

    return (
        <Container style={styles.container}>
            <ScrollView contentContainerStyle={styles.subContainer}>
                <Text style={{ fontSize: 30 }}>
                    {userProfile ? userProfile.name : ""}
                </Text>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ margin: 10 }}>
                        Email: {userProfile ? userProfile.email : ""}
                    </Text>
                    <Text style={{ margin: 10 }}>
                        Phone: {userProfile ? userProfile.phone : ""}
                    </Text>
                </View>
                {/* <View style={{ marginTop: 80 }}>
                    <Button title={"Sign Out"} onPress={() => [
                        AsyncStorage.removeItem("jwt"),
                        logoutUser(context.dispatch)
                    ]} />
                    <View style={styles.order}>
                        <Text style={{ fontSize: 20 }}>My Orders</Text>
                        <View>
                            {orders ? (
                                orders.map((order) => {
                                    return <OrderCard key={order.id} item={order} select="false" />;
                                })
                            ) : (
                                <View style={styles.order}>
                                    <Text>You have no orders</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View> */}

            </ScrollView>
        </Container>
    )
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
    order: {
        marginTop: 20,
        alignItems: "center",
        marginBottom: 60
    }
})

export default UserProfile