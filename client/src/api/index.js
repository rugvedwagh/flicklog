import { REFRESH_TOKEN } from '../constants/auth.constants'; 
import { refreshTokenApi } from './user.api';
import store from '../store'; 
import axios from 'axios';

const API = axios.create({
    baseURL: process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_API_URL
        : process.env.REACT_APP_API_URL_DEV, 
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
        const { token } = JSON.parse(profile); // Get both token and refreshToken

        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

/*
    Add a response interceptor for handling token refresh logic

    Purpose: This handles responses, particularly for refreshing expired 
    tokens when a 401 Unauthorized error occurs (typically caused by an expired access token).
*/
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

                    const { data } = await refreshTokenApi({ refreshToken });

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

