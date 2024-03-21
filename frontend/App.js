import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Main from './Navigators/Main';
import Home from './Navigators/Home';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider, extendTheme, } from "native-base";

const theme = extendTheme({ colors: newColorTheme });
const newColorTheme = {
  brand: {
    900: "#8287af",
    800: "#7c83db",
    700: "#b3bef6",
  },
};

export default function App() {
  return (
    
    <NavigationContainer>
      {/* Use the Main component */}
      <NativeBaseProvider theme={theme}>
      <Main />
      </NativeBaseProvider>
      

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});