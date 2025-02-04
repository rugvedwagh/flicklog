// import axios from 'axios';

// const API = axios.create({
//     baseURL: process.env.REACT_APP_API_URL  // Change this to your API's base URL
// });

// // Sending the Token back to our backend for it to verify
// API.interceptors.request.use((req) => {

//     const profile = localStorage.getItem('profile');

//     if (profile) {
//         const token = JSON.parse(profile).token;       
//         req.headers.Authorization = `Bearer ${token}`;
//     }

//     return req;
// });

// export default API;

// **************************************************************

import axios from 'axios';
import { refreshTokenApi } from './user.api'; // Import the refresh token API call
import { REFRESH_TOKEN } from '../constants/auth.constants'; // Import the REFRESH_TOKEN constant
import store from '../store'
import Cookies from 'js-cookie';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL_DEV, // Change this to your API's base URL
});

// Sending the Token back to our backend for it to verify
API.interceptors.request.use((req) => {
    const profile = localStorage.getItem('profile');
    if (profile) {
        const { token } = JSON.parse(profile); // Get both token and refreshToken

        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Add a response interceptor for handling token refresh logic
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const profile = localStorage.getItem('profile');
        console.log(profile);
        
        if (profile) {
            // const { refreshToken } = JSON.parse(profile); // Get the refresh token from localStorage
            const refreshToken = Cookies.get('refreshToken');
            console.log(typeof refreshToken)

            // Check if the error is related to an expired access token (401 error)
            if (error.response.status === 401 && refreshToken) {
                try {
                    // Make the API call to refresh the token
                    const { data } = await refreshTokenApi({ refreshToken });

                    // Update the local storage with the new tokens
                    localStorage.setItem(
                        'profile',
                        JSON.stringify({ ...JSON.parse(localStorage.getItem('profile')), token: data.token })
                    );

                    // Dispatch the REFRESH_TOKEN action to update the state
                    store.dispatch({
                        type: REFRESH_TOKEN,
                        payload: data.token, // Only updating the access token
                    });

                    // Retry the original request with the new token
                    originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
                    return axios(originalRequest);
                } catch (err) {
                    // If refresh token fails, redirect to login page or handle the error
                    console.error('Refresh token error:', err);
                    return Promise.reject(error);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default API;



