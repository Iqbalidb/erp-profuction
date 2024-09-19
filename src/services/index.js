// import  store  from '@store/storeConfig/store';
import axios from "axios";
import { baseUrl, cookieName, REACT_APP_AUTH_BASE_URL, REACT_APP_MERCHANDISING_BASE_URL } from "../utility/enums";

const cancelationToken = axios.CancelToken.source();
export const baseAxios = axios.create( {
    baseURL: baseUrl,
    cancelToken: cancelationToken.token
} );

export const authBaseUrl = axios.create( {
    baseURL: REACT_APP_AUTH_BASE_URL,
    cancelToken: cancelationToken.token
} );

export const merchandisingAxiosInstance = axios.create( {
    baseURL: REACT_APP_MERCHANDISING_BASE_URL,
    cancelToken: cancelationToken.token

} );

// const cookies = new Cookies();
// const accessToken = cookies.get( cookieName )?.access_token;
// const accessToken = JSON.parse( localStorage.getItem( cookieName ) );
// console.log( accessToken );
const accessToken = JSON.parse( localStorage.getItem( cookieName ) )?.access_token;
// console.log( accessToken );
console.log( accessToken );
if ( accessToken ) {
    merchandisingAxiosInstance.defaults.headers.common['Authorization'] = `bearer ${accessToken}`;
}
if ( accessToken ) {
    authBaseUrl.defaults.headers.common['Authorization'] = `bearer ${accessToken}`;
}
