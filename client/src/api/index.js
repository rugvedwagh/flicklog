import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:5000'
    // baseURL: 'https://tempback-1zo9.onrender.com'
})

//  Sending the Token back to our backend for it to verify 
API.interceptors.request.use((req) => {
    const profile = localStorage.getItem('profile');
    if (profile) {
        const token = JSON.parse(profile).token; // Safely parse the token
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const createPost = (newPost) => API.post('/posts', newPost);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const deletePost = (id) => API.delete(`/posts/${id}`);
// export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);

export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const fetchPost = (id) => API.get(`/posts/${id}`);
export const comment = (value, id) => API.post(`/posts/${id}/commentPost`, { value });

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
export const userinfo = (id) => API.get(`/user/info/${id}`);
