import { Platform } from 'react-native'


let baseURL = '';

{
    Platform.OS == 'android'
        ? baseURL = 'http://172.34.97.75:4001/api/v1'
        : baseURL = 'http:// 172.34.0.1:4001/api/v1'
        
}

export default baseURL;