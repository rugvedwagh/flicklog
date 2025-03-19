import API from './index';  

// Auth related API calls
const logInApi = (formData) => API.post('/auth/signin', formData);

const registerUserApi = (formData) => API.post('/auth/registerUser', formData);

const refreshTokenApi = (refreshToken) => API.post('/auth/refresh-token', { refreshToken });

export {
    logInApi,
    registerUserApi,
    refreshTokenApi,
}