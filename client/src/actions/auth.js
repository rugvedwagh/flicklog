import { AUTH, START_LOADING, USER_INFO, END_LOADING } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const signin = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signIn(formData);
        dispatch({ type: AUTH, payload: data });
        navigate('/posts');
    } catch (error) {
        console.log(error);
    }
};

export const signup = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signUp(formData);
        dispatch({ type: AUTH, payload: data });
        navigate('/posts')
    } catch (error) {
        console.log(error);
    }
};

export const userData = (id) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        const { data } = await api.userinfo(id);
        dispatch({ type: USER_INFO, payload: data });
        dispatch({ type: END_LOADING })
    } catch (error) {
        console.log(error);
    }
}
