import API from './index';  // Assuming you have an axios instance exported from api.js

// User-related API calls
const logInApi = (formData) => API.post('/user/signin', formData);

const registerUserApi = (formData) => API.post('/user/registerUser', formData);

const userInfoApi = (id) => API.get(`/user/i/${id}`);

const updateUserDetailsApi = (id, updatedData) => API.patch(`/user/${id}/update`, updatedData);

const refreshTokenApi = (refreshToken) => API.post('/user/refresh-token', { refreshToken });

export {
    logInApi,
    registerUserApi,
    userInfoApi,
    refreshTokenApi,
    updateUserDetailsApi
}
