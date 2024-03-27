import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

// import Orders from "../Screens/Admin/Orders"
import Products from "../Screens/Admin/Product/Products"
import ProductForm from "../Screens/Admin/Product/ProductForm"
import UpdateProductForm from "../Screens/Admin/Product/ProductUpdate"

import Brands from "../Screens/Admin/Brands/Brands"
import CreateBrand from "../Screens/Admin/Brands/CreateBrands"
import UpdateBrands from "../Screens/Admin/Brands/UpdateBrands"
import ProductList from "../Screens/Admin/Product/ProductList"

import UserList from "../Screens/Admin/User/UserList"

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
            <Stack.Screen name="UpdateBrands" component={UpdateBrands} />
            <Stack.Screen name="CreateBrand" component={CreateBrand} />
            {/* <Stack.Screen name="Orders" component={Orders} /> */}
            <Stack.Screen name="ProductForm" component={ProductForm} /> 
            <Stack.Screen name="UpdateProductForm" component={UpdateProductForm} /> 
            <Stack.Screen name="ProductList" component={ProductList} />

            <Stack.Screen name="UserList" component={UserList} />


        </Stack.Navigator>
    )
}
export default  AdminNavigator