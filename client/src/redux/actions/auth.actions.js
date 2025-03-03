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
import { getProfile } from '../../utils/storage';

const signIn = (formData, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await signInApi(formData);
        console.log(data)
        dispatch({ type: AUTH, payload: data });
        navigate('/posts');
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.error(error);
    } finally {
        dispatch({ type: END_LOADING });
    }
};

const signUp = (formData, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await signUpApi(formData);
        dispatch({ type: AUTH, payload: data });
        navigate('/posts');
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.error(error);
    } finally {
        dispatch({ type: END_LOADING });
    }
};

const fetchUserData = (id, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        navigate(`/user/i`);
        const { data } = await userInfoApi(id);
        dispatch({ type: USER_INFO, payload: data });
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

const updateUserDetails = (id, updatedData) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await updateUserDetailsApi(id, updatedData);
        const { password, __v, bookmarks, ...fileredData } = data;
        dispatch({ type: UPDATE_USER, payload: fileredData });
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
    signIn,
    signUp,
    fetchUserData,
    updateUserDetails,
    Logout,
    refreshToken,
}