import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { View, Text, StyleSheet } from 'react-native';

import ProductContainer from "../Screens/Product/ProductContainer";
import SingleProduct from '../Screens/Product/SingleProduct';
const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        component={ProductContainer}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='SingleProduct'
        component={SingleProduct}
        options={({ route }) => ({ headerShown: route.params && route.params.showHeader ? route.params.showHeader : false })}
      />
    </Stack.Navigator>
  )
}

export default function Home() {
  return <MyStack />;
}