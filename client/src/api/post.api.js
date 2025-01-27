import API from './index';  // Assuming you have an axios instance d from api.js

// Post-related API calls
const updatePostApi = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);

const createPostApi = (newPost) => API.post('/posts', newPost);

const likePostApi = (id) => API.patch(`/posts/${id}/likePost`);

const deletePostApi = (id) => API.delete(`/posts/${id}`);

const fetchPostsBySearchApi = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags || 'none'}`);

const fetchPostsApi = (page) => API.get(`/posts?page=${page}`);

const fetchPostApi = (id) => API.get(`/posts/${id}`);

const addCommentApi = (value, id) => API.post(`/posts/${id}/commentPost`, { value });   // {value} is in the body and the {id} is in the params!

const bookmarkPostApi = (postId, userId) => API.post('/user/bookmarks/add', { postId, userId });

export {
    updatePostApi,
    createPostApi,
    likePostApi,
    deletePostApi,
    fetchPostApi,
    fetchPostsApi,
    addCommentApi,
    bookmarkPostApi,
    fetchPostsBySearchApi
}