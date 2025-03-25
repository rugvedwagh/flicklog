<<<<<<< HEAD
import API from './index';
=======
import API from './index';  
>>>>>>> 22bd4d6f8cf27c0597843aeab4180117aeea7082

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