import React, { useState, useEffect } from "react";
import { Image, View, StyleSheet, Text, ScrollView, Button } from "react-native";
import { Left, Right, Container, H1, Center, Heading } from 'native-base'
import EasyButton from "../../Shared/StyledComponents/EasyButton"
import TrafficLight from '../../Shared/StyledComponents/TrafficLight'
import { addToCart } from "../../Redux/Actions/cartActions";
import { useDispatch } from 'react-redux';

const SingleProduct = ({ route,navigation }) => {
    console.log(route.params.brand)
    
    const [name, setName] = useState(route.params.name);
    const [images, setImages] = useState(route.params.images[0]);
    const [brand, setBrands] = useState(route.params.brand.name);
    const [description, setDescription] = useState(route.params.description);
    const [countInStock, setCountInStock] = useState(route.params.countInStock);
    const dispatch = useDispatch();

    // console.log(item)
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
        <Center flexGrow={1}>
            <ScrollView style={{ marginBottom: 80, padding: 5 }}>
                <View>
                    
                    <Image
                        source={{
                            uri: images ? images : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png'
                        }}
                        resizeMode="contain"
                        style={styles.image}
                    />

                </View> 
                <View style={styles.contentContainer}>
                    <Heading style={styles.contentHeader} size='xl'>{name}</Heading>
                    <Text style={styles.contentText}>{brand}</Text>
                </View>
                <View style={styles.availabilityContainer}>
                    <View style={styles.availability}>
                        <Text style={{ marginRight: 10 }}>
                            Availability: {availabilityText}
                        </Text>
                        {availability}
                    </View>
                    <Text>{description}</Text>
                </View>
                <EasyButton
                    primary
                    medium
                    onPress={handleAddToCart}
                >

                    <Text style={{ color: "white" }}> Add</Text>
                </EasyButton>
            </ScrollView>

        </Center >
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: '100%',

    },
    imageContainer: {
        backgroundColor: 'white',
        padding: 0,
        margin: 0
    },
    image: {
        width: '100%',
        height: undefined,
        aspectRatio: 1
    },
    contentContainer: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentHeader: {
        fontWeight: 'bold',
        marginBottom: 20
    },
    contentText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20
    },
    bottomContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'white'
    },
    price: {
        fontSize: 24,
        margin: 20,
        color: 'red'
    },
    availabilityContainer: {
        marginBottom: 20,
        alignItems: "center"
    },
    availability: {
        flexDirection: 'row',
        marginBottom: 10,
    }
})

export default SingleProduct