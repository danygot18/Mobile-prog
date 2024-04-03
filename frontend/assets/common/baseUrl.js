import { Platform } from 'react-native'


let baseURL = '';

{
    Platform.OS == 'android'
<<<<<<< HEAD
        ? baseURL = 'http://172.34.97.75:4001/api/v1'
        : baseURL = 'http:// 172.34.0.1:4001/api/v1'
=======
        ? baseURL = 'http://172.20.10.10:4001/api/v1'
        : baseURL = 'http://172.20.10.1:4001/api/v1'
>>>>>>> 6382963e8e331a5cc0dc9b4f944adc0ebd917f4d
        
}

export default baseURL;