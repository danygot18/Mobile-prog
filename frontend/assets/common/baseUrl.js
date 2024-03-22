import { Platform } from 'react-native'


let baseURL = '';

{
    Platform.OS == 'android'
        ? baseURL = 'http://192.168.100.46:4001/api/v1'
        : baseURL = 'http://192.168.100.1:4001/api/v1'
}

export default baseURL;