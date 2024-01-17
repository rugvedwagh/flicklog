import { FETCH_ALL, CREATE, UPDATE, LIKE, DELETE } from '../constants/actionTypes';
import * as api from '../api'   // we import everything as acitons form the api

// Action Creators
// these are functions that return actions
export const getPosts = () => async (dispatch) => {
    // console.log('all posts')
    try {
        const { data } = await api.fetchPosts();
        dispatch({ type: FETCH_ALL, payload: data })
    } catch (error) {
        console.log(error);
    }
}

export const createPost = (post) => async (dispatch) => {
    try {
        const { data } = await api.createPost(post);
        console.log('done\n')
        console.log(data)
        dispatch({ type: CREATE, payload: data })
    } catch (error) {
        console.log(error)
    }
}

export const updatePost = (id, post) => async (dispatch) => {
    try {
        const { data } = await api.updatePost(id, post)
        dispatch({ type: UPDATE, payload: data })
    } catch (error) {
        console.log(error)
    }
}

export const deletePost = (id) => async (dispatch) => {
    try {
        await api.deletePost(id);
        dispatch({ type: DELETE, payload: id })
    } catch (error) {
        console.log(error)
    }
}

export const likePost = (id) => async (dispatch) => {
    try {
        const { data } = await api.likePost(id);
        dispatch({ type: LIKE, payload: data })
    } catch (error) {
        console.log(error)
    }
}