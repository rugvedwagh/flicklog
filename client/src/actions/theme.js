import { ERROR, TOGGLE_THEME } from '../constants/themeConstants';

// Theme actions
export const toggleTheme = () => async (dispatch) => {
    try {       
        dispatch({type : TOGGLE_THEME})
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error);   
    }
};  