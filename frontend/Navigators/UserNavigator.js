import React from "react";
import { createStackNavigator } from '@react-navigation/stack'

import Login from "../Screens/User/Login";
import Register from "../Screens/User/Register";
import UserProfile from "../Screens/User/Profile";

const Stack = createStackNavigator();

const UserNavigator = (props) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="UserProfile"
                component={UserProfile}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="Register"
                component={Register}
                options={{
                    headerShown: false
                }}
            />

            
        </Stack.Navigator>
    )

}

export default UserNavigator;