import API from './index';  

// User-related API calls
const userInfoApi = (id) => API.get(`/user/account/${id}`);

const updateUserDetailsApi = (id, updatedData) => API.patch(`/user/${id}/update`, updatedData);

export {
    userInfoApi,
    updateUserDetailsApi
}
