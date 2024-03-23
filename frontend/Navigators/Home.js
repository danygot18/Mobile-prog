import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { View, Text, StyleSheet } from 'react-native';

import ProductContainer from "../Screens/Product/ProductContainer";
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

      </Stack.Navigator>
  )
}

export default function Home() {
  return <MyStack />;
}