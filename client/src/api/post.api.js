import API from './index';  // Assuming you have an axios instance exported from api.js

// Post-related API calls
export const updatePostApi = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);

export const createPostApi = (newPost) => API.post('/posts', newPost);

export const likePostApi = (id) => API.patch(`/posts/${id}/likePost`);

export const deletePostApi = (id) => API.delete(`/posts/${id}`);

export const fetchPostsBySearchApi = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags || 'none'}`);

export const fetchPostsApi = (page) => API.get(`/posts?page=${page}`);

export const fetchPostApi = (id) => API.get(`/posts/${id}`);

export const addCommentApi = (value, id) => API.post(`/posts/${id}/commentPost`, { value });
