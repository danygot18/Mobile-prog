import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList, View } from 'react-native';
import { Badge, Text, VStack, Divider, HStack } from 'native-base';

const BrandFilter = (props) => {
    console.log(props.brands)
    return (
        <ScrollView
            bounces={true}
            horizontal={true}
            style={{ backgroundColor: "#f2f2f2" }}
        >
            <VStack space={4} divider={<Divider />} w="100%">
                <HStack justifyContent="space-between">
                    <TouchableOpacity
                        key={1}
                        onPress={() => {
                            props.brandFilter('all'), props.setActive(-1)
                        }}
                    >
                        <Badge style={[styles.center, { margin: 4 },
                        props.active === -1 ? styles.active : styles.inactive]} colorScheme="info" >
                            <Text style={{ color: 'white' }}>all</Text>
                        </Badge>
                    </TouchableOpacity>
                    {props.brands.map((item) => (
                        <TouchableOpacity
                            key={item._id}
                            onPress={() => {
                                props.brandFilter(item._id),
                                    props.setActive(props.brands.indexOf(item))
                            }}
                        >
                            <Badge
                                style={[styles.center,
                                { margin: 5 },
                                props.active == props.brands.indexOf(item) ? styles.active : styles.inactive
                                ]}
                            >
                                <Text style={{ color: 'white' }}>{item.name}</Text>
                            </Badge>
                        </TouchableOpacity>
                    ))}
                </HStack>
            </VStack>

        </ScrollView>


    )
}

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    active: {
        backgroundColor: 'black'
    },
    inactive: {
        backgroundColor: '#666' // lighter shade of black
    }
})

export default BrandFilter;