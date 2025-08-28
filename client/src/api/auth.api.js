import API from './index';

// Auth related API calls
const logInApi = (formData) => API.post('/auth/login', formData);

const registerApi = (formData) => API.post('/auth/register', formData);

const refreshTokenApi = () => API.post('/auth/refresh-token/secure');

const getRefreshTokenApi = () => API.get('/auth/refresh-token');

const logoutApi = () => API.post('/auth/logout')

export {
    logInApi,
    registerApi,
    refreshTokenApi,
    getRefreshTokenApi,
    logoutApi
}