import axios from 'axios';
import { store } from '../redux/store';
import { Logout, refreshToken } from '../redux/actions/auth.actions';
import { fetchUserProfile } from '../utils/storage';
import { getAccessToken } from '../utils/getTokens';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true
});

/*
    Attaching the accessToken to the request headers for authentication.

    Purpose: This is used to attach the Authorization header with the token to each request
    before it is sent to the server. It's a global setup, ensuring that all outgoing 
    requests have the proper authentication token.
*/
API.interceptors.request.use((req) => {
    const state = store.getState();

    const accessToken = getAccessToken(state); 

    if (accessToken) {
        req.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return req;
}, (error) => {
    return Promise.reject(error);
});

/*
    Add a response interceptor for handling token refresh logic

    Purpose: This handles responses, particularly for refreshing expired 
    tokens when a 401 Unauthorized error occurs (typically caused by an expired access token).
*/
// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await store.dispatch(refreshToken());

                const updatedProfile = await fetchUserProfile();
                const { accessToken } = updatedProfile;

                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                isRefreshing = false;

                return axios(originalRequest);

            } catch (refreshError) {
                isRefreshing = false;
                await store.dispatch(Logout());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


export default API;



