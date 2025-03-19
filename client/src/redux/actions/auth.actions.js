import {
    AUTH,
    ERROR,
    LOGOUT,
    REFRESH_TOKEN,
} from '../../constants/auth.constants';
import {
    END_LOADING,
    START_LOADING
} from '../../constants/loading.constants';

import {
    refreshTokenApi,
    registerUserApi,
    logInApi
} from '../../api/auth.api';
import { getProfile } from '../../utils/storage';

const logIn = (formData, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        const { data } = await logInApi(formData);
        dispatch({ type: AUTH, payload: data });
        navigate('/posts');
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.error(error);
    } finally {
        dispatch({ type: END_LOADING });
    }
};

const registerUser = (formData, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        const { data } = await registerUserApi(formData);
        dispatch({ type: AUTH, payload: data });
        navigate('/posts');
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.error(error);
    } finally {
        dispatch({ type: END_LOADING });
    }
};

const Logout = (navigate) => (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        navigate('/');
        dispatch({ type: LOGOUT });
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.error(error);
    } finally {
        dispatch({ type: END_LOADING });
    }
};

const refreshToken = (refreshTokenFromCookies) => async (dispatch) => {
    try {
        const profile = getProfile();

        if (!profile || !refreshTokenFromCookies) {
            return;
        }
        const { data } = await refreshTokenApi(refreshTokenFromCookies);
        dispatch({ type: REFRESH_TOKEN, payload: data.accessToken });
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.error(error);
    }
};

export {
    logIn,
    registerUser,
    Logout,
    refreshToken,
}