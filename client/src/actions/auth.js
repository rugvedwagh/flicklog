import { AUTH, ERROR, USER_INFO, LOGOUT, BOOKMARK_POST, UPDATE_USER } from '../constants/authConstants';
import { END_LOADING, START_LOADING } from '../constants/loadingConstants';
import { sign_in, sign_up, user_info, bookmark_post, updateuserdetails } from '../api/userApi';


export const signIn = (formData, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        const { data } = await sign_in(formData);
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

        const { data } = await sign_up(formData);
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
        const { data } = await user_info(id);

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
        const { data } = await bookmark_post(postId, userId);

        dispatch({ type: BOOKMARK_POST, payload: data });
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error);
    }
};

export const updateUserDetails = (id, updatedData) => async (dispatch) => {
    try {
        const { data } = await updateuserdetails(id, updatedData);

        dispatch({ type: UPDATE_USER, payload: data });

        const profile = JSON.parse(localStorage.getItem('profile'));
        profile.result = data;
        localStorage.setItem('profile', JSON.stringify(profile));
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.error('Error updating user details:', error);
    }
};