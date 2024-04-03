import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    RefreshControl,
    ScrollView

} from "react-native";
import { Input, VStack, Heading, Box } from "native-base"
import Icon from "react-native-vector-icons/FontAwesome"
import { useFocusEffect } from "@react-navigation/native"
import { Searchbar } from 'react-native-paper';
import ListItem from "./ListItem"

import axios from "axios"
import baseURL from "../../../assets/common/baseUrl";
import AsyncStorage from '@react-native-async-storage/async-storage'
var { height, width } = Dimensions.get("window")
import EasyButton from "../../../Shared/StyledComponents/EasyButton";
import { useNavigation } from "@react-navigation/native"
const Products = (props) => {

    const [productList, setProductList] = useState([]);
    const [productFilter, setProductFilter] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState();
    const navigation = useNavigation()
    const [refreshing, setRefreshing] = useState(false);
    const ListHeader = () => {
        return (
            <View
                elevation={1}
                style={styles.listHeader}
            >
                <View style={styles.headerItem}>
                <Text style={{ fontWeight: '600' }}>Images</Text>
                </View>
                <View style={styles.headerItem}>
                <Text style={{ fontWeight: '600' }}>Name</Text>
                </View>
                <View style={styles.headerItem}>
                    <Text style={{ fontWeight: '600' }}>Brand</Text>
                </View>
  
                <View style={styles.headerItem}>
                    <Text style={{ fontWeight: '600' }}>Price</Text>
                </View>
                <View style={styles.headerItem}>
                    <Text style={{ fontWeight: '600' }}>Stock</Text>
                </View>
               
            </View>
        )
    }
    const searchProduct = (text) => {
        if (text === "") {
            setProductFilter(productList)
        }
        setProductFilter(
            productList.filter((i) =>
                i.name.toLowerCase().includes(text.toLowerCase())
            )
        )
    }

    const deleteProduct = (id) => {
        axios
            .delete(`${baseURL}/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const products = productFilter.filter((item) => item.id !== id)
                setProductFilter(products)
            })
            .catch((error) => console.log(error));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            axios
                .get(`${baseURL}/products`)
                .then((res) => {
                    // console.log(res.data)
                    setProductList(res.data);
                    setProductFilter(res.data);
                    setLoading(false);
                })
            setRefreshing(false);
        }, 2000);
    }, []);
    useFocusEffect(
        useCallback(
            () => {
                // Get Token
                AsyncStorage.getItem("jwt")
                    .then((res) => {
                        setToken(res)
                    })
                    .catch((error) => console.log(error))
                axios
                    .get(`${baseURL}/products/`)
                    .then((res) => {
                        console.log(res.data)
                        setProductList(res.data);
                        setProductFilter(res.data);
                        setLoading(false);
                    })

                return () => {
                    setProductList();
                    setProductFilter();
                    setLoading(true);
                }
            },
            [],
        )
    )
    return (
        <Box flex={1}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.buttonContainer}
                style={styles.scrollView} 
            >
                <View style={styles.buttonContainer}>
                <EasyButton
                    
                        secondary
                        medium
                        onPress={() => navigation.navigate("AdminCharts")}
                    >
                        <Icon name="line-chart" size={18} color="white" />
                        <Text style={styles.buttonText}>Charts</Text>
                    </EasyButton>
                    <EasyButton
                        secondary
                        medium
                        onPress={() => navigation.navigate("AdminOrderList")}
                    >
                        <Icon name="bars" size={18} color="white" />
                        <Text style={styles.buttonText}>Orders</Text>
                    </EasyButton>
                    <EasyButton
                        secondary
                        medium
                        onPress={() => navigation.navigate("ProductList")}
                    >
                        <Icon name="shopping-bag" size={18} color="white" />
                        <Text style={styles.buttonText}>Products</Text>
                    </EasyButton>
                    <EasyButton
                        secondary
                        medium
                        onPress={() => navigation.navigate("Brands")}
                    >
                        <Icon name="database" size={18} color="white" />
                        <Text style={styles.buttonText}>Brands</Text>
                    </EasyButton>
                    <EasyButton
                        secondary
                        medium
                        onPress={() => navigation.navigate("UserList")}
                    >
                        <Icon name="user" size={18} color="white" />
                        <Text style={styles.buttonText}>Users</Text>
                    </EasyButton>

                    
                    

                    
                </View>
            </ScrollView>
            <Searchbar width="80%"
                style={styles.searchBar} // Apply the Searchbar style
                placeholder="Search"
                onChangeText={(text) => searchProduct(text)}
            />
            {loading ? (
                <View style={styles.spinner}>
                    <ActivityIndicator size="large" color="red" />
                </View>
            ) : (<FlatList
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListHeaderComponent={ListHeader}
                data={productFilter}
                renderItem={({ item, index }) => (
                    <ListItem
                        item={item}
                        index={index}
                        deleteProduct={deleteProduct}

                    />
                )}
                keyExtractor={(item) => item.id}
            />)}


        </Box>
    );
}

const styles = StyleSheet.create({
    listHeader: {
        flexDirection: 'row',
        padding: 5,
        backgroundColor: 'gainsboro'
    },
    headerItem: {
        margin: 3,
        width: width / 6
    },
    spinner: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1, // Ensure the container takes all available space
        backgroundColor: 'white'
    },
    buttonContainer: {
        flexDirection: "row",
        paddingHorizontal: 10,
        flexWrap: "wrap",
    },    
    buttonText: {
        marginLeft: 4,
        color: 'white'
    },
    scrollView: {
        flex: 0, // Ensure the ScrollView does not expand vertically
        maxHeight: 50, // Limit the height of the ScrollView
    },
    searchBar: {
        width: '80%',
        alignSelf: 'center', // Center the Searchbar
        marginTop: 10, // Add some top margin to the Searchbar
        marginBottom: 10,
    },
    flatList: {
        flex: 1 // Ensure the FlatList occupies all available space vertically
    }
});


export default Products;