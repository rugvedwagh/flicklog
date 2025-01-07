import API from './index';  // Assuming you have an axios instance exported from api.js

// User-related API calls
export const sign_in = (formData) => API.post('/user/signin', formData);

export const sign_up = (formData) => API.post('/user/signup', formData);

export const user_info = (id) => API.get(`/user/i/${id}`);

export const bookmark_post = (postId, userId) => API.post('/user/bookmarks/add', { postId, userId });

export const updateuserdetails = (id, updatedData) => API.patch(`/user/${id}/update`, updatedData);


