import React, { useState, useEffect } from "react";
import { Image, View, StyleSheet, Text, ScrollView } from "react-native";
import EasyButton from "../../Shared/StyledComponents/EasyButton"
import TrafficLight from '../../Shared/StyledComponents/TrafficLight'
import { addToCart } from "../../Redux/Actions/cartActions";
import { useDispatch } from 'react-redux';
import { useNavigation } from "@react-navigation/native";
import Swiper from "react-native-swiper";

const SingleProduct = ({ route }) => {
    const [name, setName] = useState(route.params.name);
    const [images, setImages] = useState(route.params.images);
    const [brand, setBrands] = useState(route.params.brand.name);
    const [description, setDescription] = useState(route.params.description);
    const [countInStock, setCountInStock] = useState(route.params.countInStock);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [availability, setAvailability] = useState('')
    const [availabilityText, setAvailabilityText] = useState("")

    useEffect(() => {
        if (countInStock == 0) {
            setAvailability(<TrafficLight unavailable></TrafficLight>);
            setAvailabilityText("Unvailable")
        } else if (countInStock <= 5) {
            setAvailability(<TrafficLight limited></TrafficLight>);
            setAvailabilityText("Limited Stock")
        } else {
            setAvailability(<TrafficLight available></TrafficLight>);
            setAvailabilityText("Available")
        }

        return () => {
            setAvailability(null);
            setAvailabilityText("");
        }
    }, [])



    const handleAddToCart = () => {
        dispatch(addToCart({ ...route.params, quantity: 1 }));
        navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>
            <Swiper style={styles.wrapper} showsButtons={true}>
                {images.map((image, index) => (
                    <View key={index}>
                        <Image
                            source={{ uri: image }}
                            style={styles.image}
                        />
                    </View>
                ))}
            </Swiper>
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
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {},
    image: {
        width: '100%',
        height: 300,
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
