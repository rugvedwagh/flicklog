import {
    AUTH,
    CLEAR_ERROR,
    CLEAR_SUCCESS,
    ERROR,
    LOGOUT,
    REFRESH_TOKEN,
    SUCCESS_MESSAGE,
} from '../../constants/auth.constants';
import {
    END_LOADING,
    START_LOADING
} from '../../constants/loading.constants';

import {
    refreshTokenApi,
    registerApi,
    logInApi,
    logoutApi,
} from '../../api/auth.api';

const logIn = (formData, navigate) => async (dispatch) => {
    dispatch({ type: START_LOADING });

    try {
        const { data } = await logInApi(formData);
        const { csrfToken } = data;

        if (csrfToken) {
            sessionStorage.setItem('csrfToken', csrfToken);
        }

        dispatch({ type: AUTH, payload: data });
        navigate('/posts');
    } catch (error) {
        const message = error?.response?.data?.message;
        dispatch({ type: ERROR, payload: message });
        console.error('Login error:', error);
    } finally {
        dispatch({ type: END_LOADING });
    }
};

const register = (formData, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        const { data } = await registerApi(formData);
        dispatch({ type: AUTH, payload: data });
        navigate('/posts');
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message });
        console.error(error);
    } finally {
        dispatch({ type: END_LOADING });
    }
};

const Logout = () => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        await logoutApi();
        dispatch({ type: LOGOUT });
        dispatch({ type: SUCCESS_MESSAGE, payload: "Logged out successfully" })
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message });
        console.error(error);
    } finally {
        dispatch({ type: END_LOADING });
    }
};

const refreshToken = () => async (dispatch) => {
    try {
        const { data } = await refreshTokenApi();
        dispatch({ type: REFRESH_TOKEN, payload: data.accessToken });
    } catch (error) {
        console.error("Error in Refresh Token:", error.response?.data || error);
        dispatch({ type: ERROR, payload: error?.response?.data?.message });
    }
};

const clearError = () => ({
    type: CLEAR_ERROR
});

const clearSuccess = () => ({
    type: CLEAR_SUCCESS
})

export {
    logIn,
    register,
    Logout,
    clearError,
    clearSuccess,
    refreshToken,
}