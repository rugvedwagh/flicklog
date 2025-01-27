import API from './index';  // Assuming you have an axios instance exported from api.js

// User-related API calls
export const signInApi = (formData) => API.post('/user/signin', formData);

export const signUpApi = (formData) => API.post('/user/signup', formData);

export const userInfoApi = (id) => API.get(`/user/i/${id}`);

export const bookmarkPostApi = (postId, userId) => API.post('/user/bookmarks/add', { postId, userId });

export const updateUserDetailsApi = (id, updatedData) => API.patch(`/user/${id}/update`, updatedData);


