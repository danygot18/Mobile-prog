// Example using React Navigation Stack Navigator
import { createStackNavigator } from '@react-navigation/stack';
// import Mains from '../Screens/Mains';
import HomeNavigator from './Home';
import  UserNavigator  from './UserNavigator';

import Register from '../Screens/User/Register';
import { View, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/FontAwesome";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Main = () => {
  return (
    
      <Tab.Navigator
            initialRouteName="Home"
            screenOptions={ {
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#e91e63'
            }}
        >
          <Tab.Screen
                name="Home"
                component={HomeNavigator}
                options={{
                    tabBarIcon: ({color}) => {
                        return <Icon
                            name="home"
                            style={{position: "relative"}}
                            color={color}
                            size={30}

                        />
                    }
                }}
            />
            <Tab.Screen
                name="User"
                component={UserNavigator}
                options={{
                    tabBarIcon: ({color}) => {
                        return <Icon
                            name="user"
                            style={{position: "relative"}}
                            color={color}
                            size={30}

                        />
                    }
                }}
            />
            
          
    </Tab.Navigator>
  );
};

export default Main;