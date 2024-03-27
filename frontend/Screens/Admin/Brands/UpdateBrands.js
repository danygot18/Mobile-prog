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

const { width } = Dimensions.get("window");

const UpdateBrands = ({ route, navigation }) => {
    const { brandId } = route.params;
    
    const [brand, setBrand] = useState({});
    const [brandName, setBrandName] = useState("");
    const [brandLocation, setBrandLocation] = useState("");
    const [token, setToken] = useState("");
    const [images, setImages] = useState([]);
    
    useEffect(() => {
        AsyncStorage.getItem("jwt")
            .then((res) => {
                setToken(res);
            })
            .catch((error) => console.log(error));

        axios
            .get(`${baseURL}/brands/${brandId}`)
            .then((res) => {
                setBrand(res.data);
                setBrandName(res.data.name);
                setBrandLocation(res.data.location);
                setImages(res.data.images); // Assuming images are retrieved from the backend
            })
            .catch((error) => alert("Error loading brand"));

        return () => {
            setBrand({});
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

    const updateBrand = async () => {
        const updatedBrand = {
            name: brandName,
            location: brandLocation,
            images: images
        };
        
        updatedBrand.images = await setImageUpload(updatedBrand.images);
        const formData = await setFormData(updatedBrand);

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            }
        };

        axios
            .put(`${baseURL}/brands/${brandId}`, formData, config)
            .then((res) => {
                // Handle successful update
                navigation.navigate("Brands");
            })
            .catch((error) => console.log(error.response));
    };

    return (
        <View style={{ flex: 1 }}>
            <Text style={{ marginLeft: 10 }}>Name</Text>
            <TextInput
                value={brandName}
                style={styles.input}
                onChangeText={(text) => setBrandName(text)}
                placeholder="Brand Name"
            />
            <Text style={{ marginLeft: 10 }}>Location</Text>
            <TextInput
                value={brandLocation}
                style={styles.input}
                onChangeText={(text) => setBrandLocation(text)}
                placeholder="Location"
            />
            <EasyButton
                medium
                primary
                onPress={pickImage}
                style={{ marginLeft: 10 }}
            >
                <Text style={{ color: "white", fontWeight: "bold" }}>Pick Image</Text>
            </EasyButton>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                {images.map((image, index) => (
                    <View key={index} style={{ flexDirection: 'row', margin: 7 }}>
                        <Image source={{ uri: image }} style={{ width: 100, height: 100, margin: 5 }} />
                        <TouchableOpacity onPress={() => removeImage(index)}>
                            <FontAwesome name="remove" size={24} color="red" style={{ marginLeft: 6 }} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <View style={{ alignItems: "center" }}>
                <EasyButton
                    medium
                    primary
                    onPress={updateBrand}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>Update Brand</Text>
                </EasyButton>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        margin: 9,
        padding: 5,
    }
});

export default UpdateBrands;
