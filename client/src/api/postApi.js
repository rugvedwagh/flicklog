import API from './index';  // Assuming you have an axios instance exported from api.js

// Post-related API calls
export const updatepost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);

export const createpost = (newPost) => API.post('/posts', newPost);

export const likepost = (id) => API.patch(`/posts/${id}/likePost`);

export const deletepost = (id) => API.delete(`/posts/${id}`);

export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags || 'none'}`);

export const fetchPosts = (page) => API.get(`/posts?page=${page}`);

export const fetchPost = (id) => API.get(`/posts/${id}`);

export const comment = (value, id) => API.post(`/posts/${id}/commentPost`, { value });
