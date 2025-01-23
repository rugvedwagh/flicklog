import {
    FETCH_ALL,
    CREATE,
    UPDATE,
    LIKE,
    DELETE,
    FETCH_BY_SEARCH,
    FETCH_POST,
    COMMENT
} from '../constants/post.constants';
import {
    fetchPostApi,
    deletePostApi,
    fetchPostsBySearchApi
    , addCommentApi,
    fetchPostsApi,
    createPostApi,
    likePostApi,
    updatePostApi
} from '../api/post.api';
import {
    START_LOADING,
    END_LOADING
} from '../constants/loading.constants';
import { TOGGLE_THEME } from '../constants/theme.constants';
import { ERROR } from '../constants/auth.constants';

// Action Creators
// these are functions that return actions
export const getPost = (id) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })

        const { data } = await fetchPostApi(id);
        dispatch({ type: FETCH_POST, payload: data })

        dispatch({ type: END_LOADING })
    } catch (error) {
        dispatch({ type: ERROR, payload: error || 'An error occurred' });
        console.log(error);
    }
}

export const getPosts = (page) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        const cachedPosts = JSON.parse(localStorage.getItem('postsData')) || {
            posts: [],
            pages: {},
            numberOfPages: 0
        };

        if (cachedPosts.pages[page]) {
            dispatch({
                type: FETCH_ALL,
                payload: {
                    data: cachedPosts.posts,
                    currentPage: page,
                    numberOfPages: cachedPosts.numberOfPages,
                },
            });
        }
        else {
            const {
                data: {
                    data,
                    currentPage,
                    numberOfPages
                }
            } = await fetchPostsApi(page);

            const updatedPosts = [...cachedPosts.posts, ...data];

            const updatedPages = { ...cachedPosts.pages, [page]: true };

            localStorage.setItem(
                'postsData',
                JSON.stringify({
                    posts: updatedPosts,
                    pages: updatedPages,
                    numberOfPages,
                })
            );

            dispatch({
                type: FETCH_ALL,
                payload: {
                    data: updatedPosts,
                    currentPage,
                    numberOfPages
                },
            });
        }

        dispatch({ type: END_LOADING });
    } catch (error) {
        dispatch({ type: ERROR, payload: error || 'An error occurred' });
        console.error(error);
    }
};

export const getPostsBySearch = (searchQuery, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })

        const {
            data: {
                data
            }
        } = await fetchPostsBySearchApi(searchQuery)
        dispatch({
            type: FETCH_BY_SEARCH, payload: data
        })

        dispatch({ type: END_LOADING })
    } catch (error) {
        dispatch({ type: ERROR, payload: error || 'An error occurred' });
        console.log(error)
    }
}

export const createPost = (post) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })

        const { data } = await createPostApi(post);
        dispatch({ type: CREATE, payload: data })
        localStorage.removeItem('postsData')

        dispatch({ type: END_LOADING })
    } catch (error) {
        dispatch({ type: ERROR, payload: error || 'An error occurred' });
        console.log(error)
    }
}

export const updatePost = (id, post) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })

        const { data } = await updatePostApi(id, post)
        dispatch({ type: UPDATE, payload: data })

        dispatch({ type: END_LOADING })
    } catch (error) {
        dispatch({ type: ERROR, payload: error || 'An error occurred' });
        console.log(error)
    }
}

export const deletePost = (id) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })

        await deletePostApi(id);
        dispatch({ type: DELETE, payload: id })
        localStorage.removeItem('postsData')

        dispatch({ type: END_LOADING })
    } catch (error) {
        dispatch({ type: ERROR, payload: error || 'An error occurred' });
        console.log(error)
    }
}

export const likePost = (id) => async (dispatch) => {
    try {
        const { data } = await likePostApi(id);
        dispatch({ type: LIKE, payload: data })
    } catch (error) {
        dispatch({ type: ERROR, payload: error || 'An error occurred' });
        console.log(error)
    }
}

export const commentPost = (value, id) => async (dispatch) => {
    try {
        const { data } = await addCommentApi(value, id);
        dispatch({ type: COMMENT, payload: data });

        return data.comments;
    } catch (error) {
        dispatch({ type: ERROR, payload: error || 'An error occurred' });
        console.log(error);
    }
};

export const toggleTheme = () => async (dispatch) => {
    try {
        dispatch({ type: TOGGLE_THEME })
    } catch (error) {
        dispatch({ type: ERROR, payload: error || 'An error occurred' });
        console.log(error);
    }
};
