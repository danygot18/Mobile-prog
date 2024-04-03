import React, { useEffect, useState } from "react"
import {
    View,
    Text,
    FlatList,
    Dimensions,
    TextInput,
    StyleSheet,
    Button
} from "react-native"
import EasyButton from "../../../Shared/StyledComponents/EasyButton"
import baseURL from "../../../assets/common/baseUrl";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { add } from "react-native-reanimated";

var { width } = Dimensions.get("window")

const Item = (props) => {
    return (
        <View style={styles.item}>
            <View>
                <Text> Name: {props.item.name.substring(0,11)}</Text>
                <Text> price: ${props.item.price}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <EasyButton
                    primary
                    medium
                    onPress={() => props.navigation.navigate('UpdateProductForm', { productId: props.item._id })}
                    style={{ marginRight: 10 }}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>Update</Text>
                </EasyButton>
                <EasyButton
                    danger
                    medium
                    onPress={() => props.delete(props.item._id)}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
                </EasyButton>
                
            </View>
        </View>
    )
}

const Brands = ({ navigation }) => {

    const [products, setProduct] = useState([]);
    const [brandName, setBrandName] = useState();
    const [brandLocation, setBrandLocation] = useState();
    const [token, setToken] = useState();

    useEffect(() => {
        AsyncStorage.getItem("jwt")
            .then((res) => {
                setToken(res);
            })
            .catch((error) => console.log(error));

        axios
            .get(`${baseURL}/products`)
            .then((res) => setProduct(res.data))
            .catch((error) => alert("Error load brands"))

        return () => {
            setProduct();
            setToken();
        }
    }, [])

    // const addBrand = () => {
    //     const brand = {
    //         name: brandName,
    //         location: brandLocation
    //     };

    //     const config = {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         }
    //     };

    //     axios
    //         .post(`${baseURL}/brands/create`, brand, config)
    //         .then((res) => setBrands([...brands, res.data]))
    //         .catch((error) => alert("Error to load brands"));

    //     setBrandName("")
    //     setBrandLocation("");
    // }

    const deleteProduct = (id) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        };

        axios
            .delete(`${baseURL}/products/${id}`, config)
            .then((res) => {
                const newProducts = products.filter((item) => item.id !== id);
                setProduct(newProducts);
            })
            .catch((error) => alert("Error delete brands"));
    }

    return (
        <View style={{ position: "relative", height: "100%" }}>
            <View style={{ marginBottom: 60 }}>
                <FlatList
                    data={products}
                    renderItem={({ item, index }) => (
                        <Item item={item} index={index} delete={deleteProduct} navigation={navigation} />
                    )}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <View style={styles.bottomBar}>

                {/* <Text>Name</Text>
                <TextInput
                    value={brandName}
                    style={styles.input}
                    onChangeText={(text) => setBrandName(text)}
                    placeholder="Brand Name"
                />
                <Text>Location</Text>
                <TextInput
                    value={brandLocation}
                    style={styles.input}
                    onChangeText={(text) => setBrandLocation(text)}
                    placeholder="Location"
                />
                <EasyButton
                    medium
                    primary
                    onPress={() => addBrand()}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>Submit</Text>
                </EasyButton> */}
                <Button title="ADD" onPress={() => navigation.navigate('ProductForm')} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    bottomBar: {
        backgroundColor: "white",
        width: width,
        height: 60,
        padding: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        position: "absolute",
        bottom: 0,
        left: 0
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1
    },
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
        borderRadius: 5
    }
})

export default Brands;
