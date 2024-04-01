// Import necessary modules
import React, { useState, useEffect, useCallback } from "react";
import { Image, View, StyleSheet, Text, ScrollView, Dimensions, ImageBackground } from "react-native";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import TrafficLight from '../../Shared/StyledComponents/TrafficLight';
import { addToCart } from "../../Redux/Actions/cartActions";
import { useDispatch } from 'react-redux';
import ReviewSection from './ReviewSection';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Swiper from "react-native-swiper";

const SingleProduct = ({ route }) => {
    const { width } = Dimensions.get("window");
    const height = (width * 100) / 100;

    const [product, setProduct] = useState(route.params);
    const [name, setName] = useState(route.params.name);
    const [images, setImages] = useState(route.params.images);
    const [brand, setBrands] = useState(route.params.brand.name);
    const [description, setDescription] = useState(route.params.description);
    const [countInStock, setCountInStock] = useState(route.params.countInStock);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");
    const [availability, setAvailability] = useState('');
    const [availabilityText, setAvailabilityText] = useState("");

    useEffect(() => {
        if (countInStock === 0) {
            setAvailability(<TrafficLight unavailable />);
            setAvailabilityText("Unavailable");
        } else if (countInStock <= 5) {
            setAvailability(<TrafficLight limited />);
            setAvailabilityText("Limited Stock");
        } else {
            setAvailability(<TrafficLight available />);
            setAvailabilityText("Available");
        }

        return () => {
            setAvailability(null);
            setAvailabilityText("");
        };
    }, []);

    const handleAddToCart = () => {
        dispatch(addToCart({ ...route.params, quantity: 1 }));
        navigation.navigate('Home');
    };

    return (
        <ScrollView>
            <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {/* <Swiper style={styles.wrapper} showsButtons={true}> */}
                    {images.map((image, index) => (
                        // <View key={index} style={styles.imageContainer}>
                        //     <Image
                        //         source={{ uri: image }}
                        //         style={styles.image}
                        //         resizeMode="cover"
                        //     />
                        // </View>
                        <ImageBackground
                            style={{ width, height, marginTop: 25, resizeMode: "contain" }}
                            source={{ uri: image }}
                            key={index}
                        ></ImageBackground>
                    ))}
                {/* </Swiper> */}
                </ScrollView >
                <View style={styles.contentContainer}>
                    <Text style={styles.name}>Product name: {name}</Text>
                    <Text style={styles.brand}>Brand: {brand}</Text>
                    <Text style={styles.description}>Description: {description}</Text>
                    <Text style={styles.availability}>Availability: {availabilityText}</Text>
                    <Text style={styles.countInStock}>Count in Stock: {countInStock}</Text>
                    <EasyButton
                        primary
                        medium
                        onPress={handleAddToCart}
                    >
                        <Text style={styles.buttonText}>Add to Cart</Text>
                    </EasyButton>
                    <ReviewSection product={product} token={token} user={user} />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {},
    imageContainer: {
        marginTop: 100,
        alignItems: "center",
        height: 200,
        marginBottom: 20
    },
    image: {
        flex: 1,
        width: 400,
        height: 400,
        alignItems: "center",
    },
    contentContainer: {
        padding: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    brand: {
        fontSize: 18,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
    },
    availability: {
        fontSize: 16,
        marginBottom: 10,
    },
    countInStock: {
        fontSize: 16,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default SingleProduct;
