import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Dimensions, View, ScrollView } from "react-native";
import Swiper from "react-native-swiper";

var { width } = Dimensions.get("window");

const Banner = () => {
    const [bannerData, setBannerData] = useState([]);

    useEffect(() => {
        setBannerData([
            "https://i.pinimg.com/564x/fa/b0/fd/fab0fd3277de9af0aa76abdb2675389b.jpg",
            "https://i.pinimg.com/564x/35/1b/9a/351b9abfa0a0b4eefd5f43e5c57d4fb1.jpg",
            "https://i.pinimg.com/564x/d5/f2/2c/d5f22cba79815e8709d4816db76fd925.jpg",
        ]);

        return () => {
            setBannerData([]);
        };
    }, []);

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.swiper}>
                    <Swiper
                        style={{ height: width / 2 }}
                        showButtons={false}
                        autoplay={true}
                        autoplayTimeout={5}
                    >
                        {bannerData.map((item) => {
                            return (
                                <Image
                                    key={item}
                                    style={styles.imageBanner}
                                    resizeMode="contain"
                                    source={{ uri: item }}
                                />
                            );
                        })}
                    </Swiper>
                    <View style={{ height: 20 }}></View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "gainsboro",
    },
    swiper: {
        width: width,
        alignItems: "center",
        marginTop: 10,
    },
    imageBanner: {
        height: width / 2,
        width: width - 40,
        borderRadius: 10,
        marginHorizontal: 20,
    },
});

export default Banner;