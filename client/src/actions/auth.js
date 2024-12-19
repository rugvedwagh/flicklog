import { AUTH, ERROR, START_LOADING, USER_INFO, END_LOADING } from '../constants/actionTypes';
import { signIn, signUp, userinfo } from '../api/userApi';


export const signin = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await signIn(formData);
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
        const { data } = await signUp(formData);
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
        const { data } = await userinfo(id);
        dispatch({ type: USER_INFO, payload: data });
        dispatch({ type: END_LOADING })
        navigate(`/user/i/${id}`)
    } catch (error) {
        console.log(error);
    }
}