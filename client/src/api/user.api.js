import API from './index';  // Assuming you have an axios instance exported from api.js

// User-related API calls
const signInApi = (formData) => API.post('/user/signin', formData);

const signUpApi = (formData) => API.post('/user/signup', formData);

const userInfoApi = (id) => API.get(`/user/i/${id}`);

const updateUserDetailsApi = (id, updatedData) => API.patch(`/user/${id}/update`, updatedData);

export {
    signInApi,
    signUpApi,
    userInfoApi,
    updateUserDetailsApi
}
