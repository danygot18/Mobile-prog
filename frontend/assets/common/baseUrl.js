import { Platform } from 'react-native'


let baseURL = '';

{
    Platform.OS == 'android'
        ? baseURL = 'http://192.168.55.102:4001/api/v1'
        : baseURL = 'http:// 192.168.55.254:4001/api/v1'
        
}

export default baseURL;