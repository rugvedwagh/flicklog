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
    registerUserApi,
    logInApi,
    logoutApi,
} from '../../api/auth.api';

const logIn = (formData, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        const { data } = await logInApi(formData);
        dispatch({ type: AUTH, payload: data });
        navigate('/posts');
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message });
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
    registerUser,
    Logout,
    clearError,
    clearSuccess,
    refreshToken,
}