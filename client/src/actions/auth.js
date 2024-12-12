import { AUTH, ERROR, START_LOADING, USER_INFO, END_LOADING } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const signin = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signIn(formData);
        dispatch({ type: AUTH, payload: data });
        navigate('/posts');
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error);
    }
};

export const signup = (formData, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        const { data } = await api.signUp(formData);
        dispatch({ type: AUTH, payload: data });
        dispatch({type : END_LOADING})
        navigate('/posts')
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error);
    }
};

export const userData = (id, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        const { data } = await api.userinfo(id);
        dispatch({ type: USER_INFO, payload: data });
        dispatch({ type: END_LOADING })
        navigate(`/user/info/${id}`)
    } catch (error) {
        console.log(error);
    }
}