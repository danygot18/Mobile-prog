import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

// import Orders from "../Screens/Admin/Orders"
import Products from "../Screens/Admin/Products"
import ProductForm from "../Screens/Admin/ProductForm"
import Brands from "../Screens/Admin/Brands/Brands"
import CreateBrand from "../Screens/Admin/Brands/CreateBrands"

const Stack = createStackNavigator();

const AdminNavigator= () => {
    
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Products"
                component={Products}
                options={{
                    title: "Products"
                }}
            />
            <Stack.Screen name="Brands" component={Brands} />
            <Stack.Screen name="CreateBrand" component={CreateBrand} />
            {/* <Stack.Screen name="Orders" component={Orders} /> */}
            <Stack.Screen name="ProductForm" component={ProductForm} /> 
        </Stack.Navigator>
    )
}
export default  AdminNavigator