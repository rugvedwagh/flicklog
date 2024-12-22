import { AUTH, ERROR, START_LOADING, USER_INFO, END_LOADING, LOGOUT, BOOKMARK_POST } from '../constants/actionTypes';
import { signIn, signUp, userinfo, bookmarkpost } from '../api/userApi';


export const signin = (formData, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await signIn(formData);
        dispatch({ type: AUTH, payload: data });
        navigate('/posts');
        dispatch({ type: END_LOADING });
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error);
    }
};

export const signup = (formData, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        const { data } = await signUp(formData);
        dispatch({ type: AUTH, payload: data });
        navigate('/posts')
        dispatch({ type: END_LOADING })
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error);
    }
};

export const userData = (id, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        const { data } = await userinfo(id);
        dispatch({ type: USER_INFO, payload: data });
        navigate(`/user/i/${id}`)
        dispatch({ type: END_LOADING })
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error);
    }
}

export const Logout = (navigate) => (dispatch) => {
    try {
        dispatch({type : START_LOADING});
        localStorage.removeItem('profile');
        navigate('/')
        dispatch({ type: LOGOUT });
        dispatch({type : END_LOADING});
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error);
    }
};

export const bookmarkPost = (postId, userId) => async (dispatch) => {
    try {
        const { data } = await bookmarkpost(postId, userId);
        dispatch({ type: 'UPDATE_USER_BOOKMARKS', payload: data });
        dispatch({ type: BOOKMARK_POST, payload: data });
    } catch (error) {
        console.log('Error bookmarking post:', error);
    }
};