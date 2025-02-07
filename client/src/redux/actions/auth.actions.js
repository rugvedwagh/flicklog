import {
    AUTH,
    ERROR,
    USER_INFO,
    LOGOUT,
    UPDATE_USER,
    REFRESH_TOKEN,
} from '../../constants/auth.constants';
import {
    END_LOADING,
    START_LOADING
} from '../../constants/loading.constants';
import {
    signInApi,
    signUpApi,
    userInfoApi,
    updateUserDetailsApi,
    refreshTokenApi,
} from '../../api/user.api';

const signIn = (formData, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        const { data } = await signInApi(formData);
        dispatch({ type: AUTH, payload: data });
        navigate('/posts');

        dispatch({ type: END_LOADING });
    } catch (error) {
        dispatch({ type: END_LOADING });
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error);
    }
};

const signUp = (formData, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })

        const { data } = await signUpApi(formData);
        dispatch({ type: AUTH, payload: data });
        navigate('/posts')

        dispatch({ type: END_LOADING })
    } catch (error) {
        dispatch({ type: END_LOADING })
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error);
    }
};

const userData = (id, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })

        navigate(`/user/i`)
        const { data } = await userInfoApi(id);
        dispatch({ type: USER_INFO, payload: data });

        dispatch({ type: END_LOADING })
    } catch (error) {
        dispatch({ type: END_LOADING })
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error);
    }
}

const Logout = (navigate) => (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        navigate('/');
        dispatch({ type: LOGOUT });

        dispatch({ type: END_LOADING });
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error);
    }
};

const updateUserDetails = (id, updatedData) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        const { data } = await updateUserDetailsApi(id, updatedData);
        const { password, __v, bookmarks, ...fileredData } = data;
        dispatch({ type: UPDATE_USER, payload: fileredData });

        dispatch({ type: END_LOADING })
    } catch (error) {
        dispatch({ type: END_LOADING })
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.error(error);
    }
};

const refreshToken = (refreshTokenFromCookies) => async (dispatch) => {
    try {

        const profile = JSON.parse(localStorage.getItem('profile'));

        if (!profile || !refreshTokenFromCookies) {
            return;
        }
        const { data } = await refreshTokenApi(refreshTokenFromCookies);

        dispatch({ type: REFRESH_TOKEN, payload: data.token });
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error);
    }
};

export {
    signIn,
    signUp,
    userData,
    updateUserDetails,
    Logout,
    refreshToken,
}