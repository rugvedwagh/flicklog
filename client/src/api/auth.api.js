import API from './index';

// Auth related API calls
const logInApi = (formData) => API.post('/auth/signin', formData);

const registerUserApi = (formData) => API.post('/auth/registerUser', formData);

const refreshTokenApi = (refreshToken) => API.post('/auth/refresh-token', { refreshToken });

const getRefreshTokenApi = () => API.get('/auth/get-refresh-token');

const logoutApi = () => API.post('/auth/logout-user')

export {
    logInApi,
    registerUserApi,
    refreshTokenApi,
    getRefreshTokenApi,
    logoutApi
}