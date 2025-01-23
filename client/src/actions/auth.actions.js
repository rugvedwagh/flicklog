import {
    AUTH,
    ERROR,
    USER_INFO,
    LOGOUT,
    BOOKMARK_POST,
    UPDATE_USER
} from '../constants/auth.constants';
import {
    END_LOADING,
    START_LOADING
} from '../constants/loading.constants';
import {
    signInApi,
    signUpApi,
    userInfoApi,
    bookmarkPostApi,
    updateUserDetailsApi
} from '../api/user.api';


export const signIn = (formData, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        const { data } = await signInApi(formData);
        dispatch({ type: AUTH, payload: data });
        navigate('/posts');

        dispatch({ type: END_LOADING });
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error);
    }
};

export const signUp = (formData, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })

        const { data } = await signUpApi(formData);
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

        navigate(`/user/i`)
        const { data } = await userInfoApi(id);
        dispatch({ type: USER_INFO, payload: data });

        dispatch({ type: END_LOADING })
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error);
    }
}

export const Logout = (navigate) => (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        localStorage.removeItem('profile');
        localStorage.removeItem('postsData')
        navigate('/')
        dispatch({ type: LOGOUT });

        dispatch({ type: END_LOADING });
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error);
    }
};

export const bookmarkPost = (postId, userId) => async (dispatch) => {
    try {
        const { data } = await bookmarkPostApi(postId, userId);

        dispatch({ type: BOOKMARK_POST, payload: data });
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error);
    }
};

export const updateUserDetails = (id, updatedData) => async (dispatch) => {
    try {
        const { data } = await updateUserDetailsApi(id, updatedData);

        dispatch({ type: UPDATE_USER, payload: data });

        const profile = JSON.parse(localStorage.getItem('profile'));
        profile.result = data;
        localStorage.setItem('profile', JSON.stringify(profile));
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.error('Error updating user details:', error);
    }
};