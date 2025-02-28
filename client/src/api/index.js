import axios from 'axios';
import { store } from '../redux/store';
import { refreshToken } from '../redux/actions/auth.actions';
import { getProfile } from '../utils/storage';
import { getRefreshToken } from '../utils/getTokens';

const API = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ?
        process.env.REACT_APP_API_URL :
        process.env.REACT_APP_API_URL_DEV
});

/*
    Attaching the accessToken to the request headers for authentication.

    Purpose: This is used to attach the Authorization header with the token to each request
    before it is sent to the server. It's a global setup, ensuring that all outgoing 
    requests have the proper authentication token.
*/
API.interceptors.request.use((req) => {
    const profile = getProfile();

    if (profile) {
        const { accessToken } = profile;
        req.headers['Authorization'] = `Bearer ${accessToken}`;
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
        const profile = getProfile();
        const refreshTokenFromCookies = getRefreshToken();

        if (profile && error.response.status === 401) {
            try {
                await store.dispatch(refreshToken(refreshTokenFromCookies));
                const updatedProfile = getProfile();
                const { accessToken } = updatedProfile;
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                return axios(originalRequest);
            } catch (err) {
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default API;



