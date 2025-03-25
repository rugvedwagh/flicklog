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
    logInApi,
    logoutApi,
} from '../../api/auth.api';
import { getProfile } from '../../utils/storage';
import { getRefreshToken } from '../../utils/getTokens';

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

const Logout = (navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        await logoutApi();
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
            console.error("❌ Missing profile or refresh token");
            return;
        }

        const { data } = await refreshTokenApi(refreshTokenFromCookies);

        dispatch({ type: REFRESH_TOKEN, payload: data.accessToken });
    } catch (error) {
        console.error("❌ Error in Refresh Token:", error.response?.data || error);
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
    }
};

export {
    logIn,
    registerUser,
    Logout,
    refreshToken,
}