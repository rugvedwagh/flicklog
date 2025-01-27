import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL  // Change this to your API's base URL
});

// Sending the Token back to our backend for it to verify
API.interceptors.request.use((req) => {

    const profile = localStorage.getItem('profile');

    if (profile) {
        const token = JSON.parse(profile).token;       
        req.headers.Authorization = `Bearer ${token}`;
    }
    
    return req;
});

export default API;