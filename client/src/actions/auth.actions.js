import {
    AUTH,
    ERROR,
    USER_INFO,
    LOGOUT,
    UPDATE_USER,
    REFRESH_TOKEN
} from '../constants/auth.constants';
import {
    END_LOADING,
    START_LOADING
} from '../constants/loading.constants';
import {
    signInApi,
    signUpApi,
    userInfoApi,
    updateUserDetailsApi,
    refreshTokenApi
} from '../api/user.api';
import Cookies from 'js-cookie'

const signIn = (formData, navigate) => async (dispatch) => {
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

const signUp = (formData, navigate) => async (dispatch) => {
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

const userData = (id, navigate) => async (dispatch) => {
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

const Logout = (navigate) => (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        // Get the profile from localStorage
        const profile = JSON.parse(localStorage.getItem('profile'));

        if (profile) {
            // Remove only the access token, not the refresh token
            profile.token = null;
            localStorage.setItem('profile', JSON.stringify(profile));
        }

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
        dispatch({ type: UPDATE_USER, payload: data });

        const profile = JSON.parse(localStorage.getItem('profile'));
        profile.result = data;
        localStorage.setItem('profile', JSON.stringify(profile));

        dispatch({ type: END_LOADING })
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.error(error);
    }
};

// Action to refresh the token
const refreshToken = () => async (dispatch) => {
    try {
        const profile = JSON.parse(localStorage.getItem('profile'));
        const refreshTokenFromCookies = Cookies.get('refreshToken');

        // If no profile or refresh token exists, return
        if (!profile || refreshTokenFromCookies) {
            return;
        }

        dispatch({ type: START_LOADING });

        const { data } = await refreshTokenApi(refreshTokenFromCookies);  // Implement the API call to refresh the token
        dispatch({ type: REFRESH_TOKEN, payload: data });
        console.log(data)

        // Update profile in localStorage with new tokens
        const updatedProfile = { ...profile, result: { ...profile.result, token: data.token } };
        localStorage.setItem('profile', JSON.stringify(updatedProfile));
        

        dispatch({ type: END_LOADING });
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
    refreshToken
}