// Example using React Navigation Stack Navigator
import { createStackNavigator } from '@react-navigation/stack';
// import Mains from '../Screens/Mains';
import HomeNavigator from './Home';
import UserNavigator  from './UserNavigator';
import AdminNavigator  from './AdminNavigator';
import CartNavigator  from './CartNavigator';
import Cart from "../Screens/Cart/Cart";

import Register from '../Screens/User/Register';
import { View, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/FontAwesome";
import CartIcon from "../Shared/CartIcon";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Main = () => {
  return (
    
      <Tab.Navigator
            initialRouteName="Home"
            screenOptions={ {
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: false,
                tabBarActiveTintColor: 'black'
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
            {/* <Tab.Screen
                name="Admin"
                component={AdminNavigator}
                options={{
                    tabBarIcon: ({color}) => {
                        return <Icon
                            name="cog"
                            style={{position: "relative"}}
                            color={color}
                            size={30}

                        />
                    }
                }}
            /> */}

            <Tab.Screen
                name="Cart"
                component={CartNavigator}
                options={{
                    tabBarIcon: ({color}) => {
                        return <><Icon
                            name="shopping-cart"
                            style={{position: "relative"}}
                            color={color}
                            size={30}

                        />
                        <CartIcon />
                        </>
                        
                    }
                }}
            />
            
            <Tab.Screen
                name="Profile"
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