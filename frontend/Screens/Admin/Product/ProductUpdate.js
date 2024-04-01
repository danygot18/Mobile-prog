import React, { useState, useEffect } from "react";
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
import FormContainer from "../../../Shared/Form/FormContainer";
import Input from "../../../Shared/Form/Input";
import EasyButton from "../../../Shared/StyledComponents/EasyButton";
import Error from "../../../Shared/Error";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import { setFormData, setImageUpload } from "../../../utils/formData";
import { Item, Picker, Select, Box } from "native-base";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import SyncStorage from "sync-storage";

const UpdateProductForm = ({ route }) => {

    const { productId } = route.params;
    const [product, setProduct] = useState({});
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [countInStock, setCountInStock] = useState("");
    const [brands, setBrands] = useState([]);
    const [error, setError] = useState();
    const [pickerValue, setPickerValue] = useState('');
    const [token, setToken] = useState("");
    const [images, setImages] = useState([]);

    let navigation = useNavigation();
    console.log(productId)

    useEffect(() => {
        AsyncStorage.getItem("jwt")
            .then((res) => {
                setToken(res);
            })
            .catch((error) => console.log(error));

        axios
            .get(`${baseURL}/products/${productId}`)
            .then((res) => {
                setProduct(res.data);
                setName(res.data.name);
                setDescription(res.data.description);
                setPrice(res.data.price.toString());
                setCountInStock(res.data.countInStock.toString());
                setImages(res.data.images);
                setPickerValue(res.data.brand._id);
            })
            .catch((error) => alert("Error loading product"));

        axios
            .get(`${baseURL}/brands`)
            .then((res) => setBrands(res.data))
            .catch((error) => alert("Error loading brands"));

        return () => {
            setProduct({});
            setToken("");
        };
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.cancelled) {
            setImages(prevImages => [...prevImages, result.uri]);
        }
    };

    const removeImage = (index) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const updateProduct = async () => {
        try {
            const updatedProduct = {
                name: name,
                price: price,
                description: description,
                countInStock: countInStock,
                brand: pickerValue,
                images: images
            };
            updatedProduct.images = await setImageUpload(updatedProduct.images);
            const formData = await setFormData(updatedProduct);

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.put(`${baseURL}/products/${productId}`, formData, config);
            if (response.status === 200 || response.status === 201) {
                navigation.navigate("Products");
            }
        } catch (error) {
            console.log(error);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <FormContainer title="Update Product">
            {error ? <Error message={error} /> : null}
            <EasyButton
                medium
                primary
                onPress={pickImage}
                style={{ marginLeft: 10 }}
            >
                <Text style={{ color: "white", fontWeight: "bold" }}>Pick Image</Text>
            </EasyButton>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                {images.map((images, index) => (
                    <View key={index} style={{ flexDirection: 'row', margin: 7 }}>
                        <Image source={{ uri: images }} style={{ width: 100, height: 100, margin: 5 }} />
                        <TouchableOpacity onPress={() => removeImage(index)}>
                            <FontAwesome name="remove" size={24} color="red" style={{ marginLeft: 6 }} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <Input
                placeholder="Name"
                name="name"
                id="name"
                value={name}
                onChangeText={(text) => setName(text)}
            />
            <Input
                placeholder="Price"
                name="price"
                id="price"
                value={price}
                keyboardType={"numeric"}
                onChangeText={(text) => setPrice(text)}
            />
            <Input
                placeholder="Description"
                name="description"
                id="description"
                value={description}
                onChangeText={(text) => setDescription(text)}
            />
            <Input
                placeholder="Count in Stock"
                name="stock"
                id="stock"
                value={countInStock}
                keyboardType={"numeric"}
                onChangeText={(text) => setCountInStock(text)}
            />
            <Box>
                <Select
                    minWidth="90%"
                    placeholder="Select your Brand"
                    selectedValue={pickerValue}
                    onValueChange={(value) => setPickerValue(value)}
                >
                    {brands.map((brand) => (
                        <Select.Item
                            key={brand.id}
                            label={brand.name}
                            value={brand.id}
                        />
                    ))}
                </Select>
            </Box>
            <View style={styles.buttonContainer}>
                <EasyButton
                    large
                    primary
                    onPress={updateProduct}
                >
                    <Text style={styles.buttonText}>Update Product</Text>
                </EasyButton>
            </View>
        </FormContainer>
    );
};

const styles = StyleSheet.create({
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

export default UpdateProductForm;
