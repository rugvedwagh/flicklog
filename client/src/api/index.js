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
import store from '../store'
import { refreshToken } from '../actions/auth.actions';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Change this to your API's base URL
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

        if (profile) {
            if (error.response.status === 401) {
                try {
                    await store.dispatch(refreshToken());   // "await" Otherwise the code below this line is exuced before the localstorage is updated

                    const profile = JSON.parse(localStorage.getItem('profile'));
                    originalRequest.headers['Authorization'] = `Bearer ${profile?.token}`;
                    
                    return axios(originalRequest);
                } catch (err) {
                    return Promise.reject(error);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default API;



