import React, { useState, useEffect } from "react"
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Platform
} from "react-native"
import { Item, Picker, Select, Box } from "native-base"
import FormContainer from "../../../Shared/Form/FormContainer"
import Input from "../../../Shared/Form/Input"
import EasyButton from "../../../Shared/StyledComponents/EasyButton"

import Icon from "react-native-vector-icons/FontAwesome"
import Toast from "react-native-toast-message"
import AsyncStorage from '@react-native-async-storage/async-storage'
import baseURL from "../../../assets/common/baseUrl"
import Error from "../../../Shared/Error"
import axios from "axios"
import * as ImagePicker from "expo-image-picker"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import mime from "mime";
import { setFormData, setImageUpload } from "../../../utils/formData"
import { FontAwesome } from '@expo/vector-icons';


const ProductForm = (props) => {
    // console.log(props.route.params)
    const [pickerValue, setPickerValue] = useState('');
    const [products, setProduct] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [images, setImage] = useState([]);
    const [mainImage, setMainImage] = useState();
    const [brand, setBrand] = useState('');
    const [brands, setBrands] = useState([]);
    const [token, setToken] = useState();
    const [error, setError] = useState();
    const [countInStock, setCountInStock] = useState();
    const [rating, setRating] = useState(0);
    const [isFeatured, setIsFeatured] = useState(false);
    const [richDescription, setRichDescription] = useState();
    const [numReviews, setNumReviews] = useState(0);
    const [item, setItem] = useState(null);

    let navigation = useNavigation()

    useEffect(() => {
        if (!props.route.params) {
            setItem(null);
        } else {
            setItem(props.route.params.item);
            setName(props.route.params.item.name);
            setPrice(props.route.params.item.price.toString());
            setDescription(props.route.params.item.description);
            setMainImage(props.route.params.item.image);
            setImage(props.route.params.item.image);
            setBrand(props.route.params.item.brand._id);
            setPickerValue(props.route.params.item.brand._id);
            setCountInStock(props.route.params.item.countInStock.toString());
        }
        AsyncStorage.getItem("jwt")
            .then((res) => {
                setToken(res)
            })
            .catch((error) => console.log(error))
        axios
            .get(`${baseURL}/brands`)
            .then((res) => setBrands(res.data))
            .catch((error) => alert("Error to load brands"));
        (async () => {
            if (Platform.OS !== "web") {
                const {
                    status,
                } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== "granted") {
                    alert("Sorry, we need camera roll permissions to make this work!")
                }
            }
        })();
        return () => {
            setBrands([])
        }
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.canceled) {
            console.log(result.assets)
            setMainImage(result.assets[0].uri);
            setImage(prevImages => [...prevImages, result.uri]);
        }
    }
    const removeImage = (index) => {
        setImage(prevImages => prevImages.filter((_, i) => i !== index));
    };


    const addProduct = async () => {

        const product = {
            name: name,
            price: price,
            description: description,
            brand: brand,
            countInStock: countInStock,
            images: images

        };
        product.images = await setImageUpload(product.images)

        const formData = await setFormData(product)

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            }
        };

        axios.post(`${baseURL}/products/create`, formData, config)
            .then((res) => {
                setProduct([...products, res.data])
                setName("");
                setPrice("");
                setDescription("");
                setBrand("");
                setCountInStock("")
                setRichDescription("");
                setRating("");
                setNumReviews("");
                setImage([])
                navigation.navigate("Products")
            })
            .catch((errror) => console.log(error.response))

        // if (
        //     name === "" ||
        //     price === "" ||
        //     description === "" ||
        //     brand === "" ||
        //     countInStock === ""
        // ) {
        //     setError("Please fill in the form correctly")
        // }

        // let formData = new FormData();
        // const newImageUri = "file:///" + image.split("file:/").join("");

        // formData.append("name", name);
        // formData.append("price", price);
        // formData.append("description", description);
        // formData.append("brand", brand);
        // formData.append("countInStock", countInStock);
        // formData.append("richDescription", richDescription);
        // formData.append("rating", rating);
        // formData.append("numReviews", numReviews);
        // formData.append("isFeatured", isFeatured);
        // formData.append("image", {
        //     uri: newImageUri,
        //     type: mime.getType(newImageUri),
        //     name: newImageUri.split("/").pop()
        // });

        // const config = {
        //     headers: {
        //         "Content-Type": "multipart/form-data",
        //         "Authorization": `Bearer ${token}`
        //     }
        // }
        // if (item !== null) {
        //     console.log(item)
        //     axios
        //         .put(`${baseURL}/products/${item.id}`, formData, config)
        //         .then((res) => {
        //             if (res.status === 200 || res.status === 201) {
        //                 Toast.show({
        //                     topOffset: 60,
        //                     type: "success",
        //                     text1: "Product successfuly updated",
        //                     text2: ""
        //                 });
        //                 setTimeout(() => {
        //                     navigation.navigate("Products");
        //                 }, 500)
        //             }
        //         })
        //         .catch((error) => {
        //             Toast.show({
        //                 topOffset: 60,
        //                 type: "error",
        //                 text1: "Something went wrong",
        //                 text2: "Please try again"
        //             })
        //         })
        // } else {
        //     axios
        //         .post(`${baseURL}/products`, formData, config)
        //         .then((res) => {
        //             if (res.status === 200 || res.status === 201) {
        //                 Toast.show({
        //                     topOffset: 60,
        //                     type: "success",
        //                     text1: "New Product added",
        //                     text2: ""
        //                 });
        //                 setTimeout(() => {
        //                     navigation.navigate("Products");
        //                 }, 500)
        //             }
        //         })
        //         .catch((error) => {
        //             console.log(error)
        //             Toast.show({
        //                 topOffset: 60,
        //                 type: "error",
        //                 text1: "Something went wrong",
        //                 text2: "Please try again"
        //             })
        //         })

        // }

    }
    return (
        <FormContainer title="Add Product">
            <EasyButton
                medium
                primary
                onPress={pickImage}
                style={{ marginLeft: 10 }}
            >
                <Text style={{ color: "white", fontWeight: "bold" }}>Pick Image</Text>
            </EasyButton>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                {images?.map((image, index) => (
                    <View key={index} style={{ flexDirection: 'row', margin: 7 }}>
                        <Image source={{ uri: image }} style={{ width: 100, height: 100, margin: 5 }} />
                        <TouchableOpacity onPress={() => removeImage(index)}>
                            <FontAwesome name="remove" size={24} color="red" style={{ marginLeft: 6 }} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <View style={styles.label}>
                <Text style={{ textDecorationLine: "underline" }}>Name</Text>
            </View>
            <Input
                placeholder="Name"
                name="name"
                id="name"
                value={name}
                onChangeText={(text) => setName(text)}
            />
            <View style={styles.label}>
                <Text style={{ textDecorationLine: "underline" }}>Price</Text>
            </View>
            <Input
                placeholder="Price"
                name="price"
                id="price"
                value={price}
                keyboardType={"numeric"}
                onChangeText={(text) => setPrice(text)}
            />
            <View style={styles.label}>
                <Text style={{ textDecorationLine: "underline" }}>Count in Stock</Text>
            </View>
            <Input
                placeholder="Stock"
                name="stock"
                id="stock"
                value={countInStock}
                keyboardType={"numeric"}
                onChangeText={(text) => setCountInStock(text)}
            />
            <View style={styles.label}>
                <Text style={{ textDecorationLine: "underline" }}>Description</Text>
            </View>
            <Input
                placeholder="Description"
                name="description"
                id="description"
                value={description}
                onChangeText={(text) => setDescription(text)}
            />
            <Box>
                <Select
                    minWidth="90%" placeholder="Select your Brand"
                    selectedValue={pickerValue}
                    onValueChange={(e) => [setPickerValue(e), setBrand(e)]}
                >
                    {brands.map((c, index) => {
                        return (
                            <Select.Item
                                key={c.id}
                                label={c.name}
                                value={c.id} />
                        )
                    })}

                </Select>
            </Box>

            {error ? <Error message={error} /> : null}
            <View style={styles.buttonContainer}>
                <EasyButton
                    large
                    primary
                    onPress={() => addProduct()}
                ><Text style={styles.buttonText}>Confirm</Text>
                </EasyButton>
            </View>
        </FormContainer>
    )
}


const styles = StyleSheet.create({
    label: {
        width: "80%",
        marginTop: 10
    },
    buttonContainer: {
        width: "80%",
        marginBottom: 80,
        marginTop: 20,
        alignItems: "center"
    },
    buttonText: {
        color: "white"
    },
    imageContainer: {
        width: 200,
        height: 200,
        borderStyle: "solid",
        borderWidth: 8,
        padding: 0,
        justifyContent: "center",
        borderRadius: 100,
        borderColor: "#E0E0E0",
        elevation: 10
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 100
    },
    imagePicker: {
        position: "absolute",
        right: 5,
        bottom: 5,
        backgroundColor: "grey",
        padding: 8,
        borderRadius: 100,
        elevation: 20
    }
})


export default ProductForm;