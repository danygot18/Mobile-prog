import { Platform } from 'react-native'


let baseURL = '';

{
    Platform.OS == 'android'
<<<<<<< HEAD
        ? baseURL = 'http://172.34.97.75:4001/api/v1'
        : baseURL = 'http:// 172.34.0.1:4001/api/v1'
=======
        ? baseURL = 'http://172.34.96.126:4001/api/v1'
        : baseURL = 'http://172.34.0.1:4001/api/v1'
>>>>>>> e4b927f9daf216635eeaa9c7ebcd550c191120bc
        
}

export default baseURL;