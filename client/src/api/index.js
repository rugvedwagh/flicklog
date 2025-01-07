import axios from 'axios';

const API = axios.create({
    baseURL: 'https://remserver01.onrender.com'  // Change this to your API's base URL
});

// Sending the Token back to our backend for it to verify
API.interceptors.request.use((req) => {
    const profile = localStorage.getItem('profile');
    if (profile) {
        const token = JSON.parse(profile).token; // Safely parse the token
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;