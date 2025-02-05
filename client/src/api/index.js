import axios from 'axios';
import store from '../redux/store';
import Cookies from 'js-cookie';
import { refreshToken } from '../redux/actions/auth.actions';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL_DEV, // Change this to your API's base URL
});

/*
    Attaching the accessToken to the request headers for authentication.

    Purpose: This is used to attach the Authorization header with the token to each request
    before it is sent to the server. It's a global setup, ensuring that all outgoing 
    requests have the proper authentication token.
*/
API.interceptors.request.use((req) => {
    const profile = localStorage.getItem('profile');

    if (profile) {
        const { token } = JSON.parse(profile);         
        req.headers['Authorization'] = `Bearer ${token}`;
    }
    return req;
});

/*
    Add a response interceptor for handling token refresh logic

    Purpose: This handles responses, particularly for refreshing expired 
    tokens when a 401 Unauthorized error occurs (typically caused by an expired access token).
*/
API.interceptors.response.use((response) => response,
    async (error) => {
        const originalRequest = error.config;
        const profile = localStorage.getItem('profile');
        const refreshTokenFromCookies = Cookies.get('refreshToken');

        if (profile && error.response.status === 401) {
            try {
                await store.dispatch(refreshToken(refreshTokenFromCookies));   // "await" Otherwise the code below this line is exuced before the localstorage is updated

                const profile = JSON.parse(localStorage.getItem('profile'));
                originalRequest.headers['Authorization'] = `Bearer ${profile?.token}`;

                return axios(originalRequest);
            } catch (err) {
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default API;



