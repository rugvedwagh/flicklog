import API from './index';  // Assuming you have an axios instance exported from api.js

// User-related API calls
export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
export const userinfo = (id) => API.get(`/user/i/${id}`);
