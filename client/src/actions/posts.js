import { FETCH_ALL, CREATE, UPDATE, LIKE, DELETE, FETCH_BY_SEARCH, START_LOADING, END_LOADING, FETCH_POST, COMMENT, ERROR } from '../constants/actionTypes';
import { fetchPost, deletepost, fetchPostsBySearch, comment, fetchPosts, createpost, likepost, updatepost } from '../api/postApi';


// Action Creators
// these are functions that return actions
export const getPost = (id) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        const { data } = await fetchPost(id);
        dispatch({ type: FETCH_POST, payload: data })
        dispatch({ type: END_LOADING })
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error);
    }
}

export const getPosts = (page) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        // Ensure cachedPosts structure is initialized properly
        const cachedPosts = JSON.parse(localStorage.getItem('postsData')) || { posts: [], pages: {}, numberOfPages: 0 };

        if (cachedPosts.pages[page]) {
            // Use cached data if the current page exists in the cache
            dispatch({
                type: FETCH_ALL,
                payload: {
                    data: cachedPosts.posts,
                    currentPage: page,
                    numberOfPages: cachedPosts.numberOfPages,
                },
            });
        } else {
            // Fetch new posts if not cached
            const { data: { data, currentPage, numberOfPages } } = await fetchPosts(page);

            // Append new posts to the existing cached posts
            const updatedPosts = [...cachedPosts.posts, ...data];

            // Mark the current page as cached
            const updatedPages = { ...cachedPosts.pages, [page]: true };

            // Update localStorage with the new data
            localStorage.setItem(
                'postsData',
                JSON.stringify({
                    posts: updatedPosts,
                    pages: updatedPages,
                    numberOfPages,
                })
            );

            // Dispatch the updated data
            dispatch({
                type: FETCH_ALL,
                payload: { data: updatedPosts, currentPage, numberOfPages },
            });
        }

        dispatch({ type: END_LOADING });
    } catch (error) {
        dispatch({
            type: ERROR,
            payload: error?.response?.data?.message || 'An error occurred',
        });
        console.error(error);
    }
};

export const getPostsBySearch = (searchQuery) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })

        const { data: { data } } = await fetchPostsBySearch(searchQuery)
        dispatch({ type: FETCH_BY_SEARCH, payload: data })
        
        dispatch({ type: END_LOADING })
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error)
    }
}

export const createPost = (post) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        const { data } = await createpost(post);
        dispatch({ type: CREATE, payload: data })
        dispatch({ type: END_LOADING })
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error)
    }
}

export const updatePost = (id, post) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        const { data } = await updatepost(id, post)
        dispatch({ type: UPDATE, payload: data })
        dispatch({ type: END_LOADING })
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error)
    }
}

export const deletePost = (id) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        await deletepost(id);
        dispatch({ type: DELETE, payload: id })
        dispatch({ type: END_LOADING })
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error)
    }
}

export const likePost = (id) => async (dispatch) => {
    try {
        const { data } = await likepost(id);
        dispatch({ type: LIKE, payload: data })
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error)
    }
}

export const commentPost = (value, id) => async (dispatch) => {
    try {
        const { data } = await comment(value, id);
        dispatch({ type: COMMENT, payload: data });

        return data.comments;
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error);
    }
};

