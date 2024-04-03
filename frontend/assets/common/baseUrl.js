import { Platform } from 'react-native'


let baseURL = '';

{
    Platform.OS == 'android'
        ? baseURL = 'http://172.20.10.10:4001/api/v1'
        : baseURL = 'http://172.20.10.1:4001/api/v1'
        
}

export default baseURL;