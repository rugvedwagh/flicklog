import axios from 'axios';
import store from '../store'; // Import Redux store
import { refreshTokenApi } from './user.api'; // Import the refresh token API call
import { REFRESH_TOKEN } from '../constants/auth.constants'; // Import the REFRESH_TOKEN constant

const API = axios.create({
    baseURL: process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_API_URL
        : process.env.REACT_APP_API_URL_DEV, // Set the correct API URL based on environment
});

// Sending the accessToken back to our backend for it to verify
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
    (response) => response, // Return successful responses as is
    async (error) => {
        const originalRequest = error.config;
        const profile = localStorage.getItem('profile');

        if (profile) {
            const { refreshToken } = JSON.parse(profile);

            // Check if the error is related to an expired access token (401 error)
            if (error.response.status === 401 && refreshToken) {
                try {
                    // Make the API call to refresh the token
                    const { data } = await refreshTokenApi({ refreshToken });

                    // Dispatch the REFRESH_TOKEN action to update Redux state
                    store.dispatch({
                        type: REFRESH_TOKEN,
                        payload: data.token, 
                    });

                    // Retry the original request with the new token
                    originalRequest.headers['Authorization'] = `Bearer ${data.token}`;

                    return API(originalRequest);
                } catch (err) {
                    return Promise.reject(error); 
                }
            }
        }
        return Promise.reject(error);
    }
);

export default API;

