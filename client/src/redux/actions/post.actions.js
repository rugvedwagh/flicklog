import {
    FETCH_ALL,
    CREATE,
    UPDATE,
    LIKE,
    DELETE,
    FETCH_BY_SEARCH,
    FETCH_POST,
    COMMENT,
    LIKED_POSTS,
    USER_POSTS,
    BOOKMARK_POST
} from '../../constants/post.constants';
import {
    fetchPostApi,
    deletePostApi,
    fetchPostsBySearchApi,
    addCommentApi,
    fetchPostsApi,
    createPostApi,
    likePostApi,
    updatePostApi,
    bookmarkPostApi
} from '../../api/post.api';
import {
    START_LOADING,
    END_LOADING
} from '../../constants/loading.constants';
import { ERROR } from '../../constants/auth.constants';

const fetchPost = (id) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await fetchPostApi(id);
        dispatch({ type: FETCH_POST, payload: data });
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.error(error);
    } finally {
        dispatch({ type: END_LOADING });
    }
};

const fetchPosts = (page) => async (dispatch, getState) => {
    try {
        dispatch({ type: START_LOADING });

        const { posts, currentPage: storedPage } = getState().postsReducer;

        if (posts.length > 0 && storedPage === page) {
            dispatch({ type: END_LOADING });
        }
        else {
            const { data: { data, currentPage, numberOfPages } } = await fetchPostsApi(page);
            dispatch({ type: FETCH_ALL, payload: { data, currentPage, numberOfPages } });
        }
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || "An error occurred" });
    } finally {
        dispatch({ type: END_LOADING });
    }
};

const fetchPostsBySearch = (searchQuery) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data: { data } } = await fetchPostsBySearchApi(searchQuery);
        dispatch({ type: FETCH_BY_SEARCH, payload: data });
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.error(error);
    } finally {
        dispatch({ type: END_LOADING });
    }
};

const createPost = (post) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await createPostApi(post);
        dispatch({ type: CREATE, payload: data });
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.error(error);
    } finally {
        dispatch({ type: END_LOADING });
    }
};

const updatePost = (id, post) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await updatePostApi(id, post);
        dispatch({ type: UPDATE, payload: data });
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.error(error);
    } finally {
        dispatch({ type: END_LOADING });
    }
};

const deletePost = (id) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        await deletePostApi(id);
        dispatch({ type: DELETE, payload: id });
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.error(error);
    } finally {
        dispatch({ type: END_LOADING });
    }
};

const likePost = (id) => async (dispatch) => {
    try {
        const { data } = await likePostApi(id);
        dispatch({ type: LIKE, payload: data });
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.error(error);
    }
};

const addComment = (value, id) => async (dispatch) => {
    try {
        const { data } = await addCommentApi(value, id);
        dispatch({ type: COMMENT, payload: data });
        return data.comments;
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.error(error);
    }
};

const bookmarkPost = (postId, userId) => async (dispatch) => {
    try {
        const { data } = await bookmarkPostApi(postId, userId);
        dispatch({ type: BOOKMARK_POST, payload: data });
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.error(error);
    }
};

const likedPosts = (data) => async (dispatch) => {
    try {
        dispatch({ type: LIKED_POSTS, payload: data });
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.error(error);
    }
};

const userPosts = (data) => async (dispatch) => {
    try {
        dispatch({ type: USER_POSTS, payload: data });
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.error(error);
    }
};

export {
    fetchPost,
    fetchPosts,
    fetchPostsBySearch,
    createPost,
    updatePost,
    deletePost,
    userPosts,
    likePost,
    likedPosts,
    addComment,
    bookmarkPost
};
