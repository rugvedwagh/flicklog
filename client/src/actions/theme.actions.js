import { ERROR, TOGGLE_THEME } from '../constants/theme.constants';

// Theme actions
const toggleTheme = () => async (dispatch) => {
    try {
        dispatch({ type: TOGGLE_THEME })
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message || 'An error occurred' });
        console.log(error);
    }
};

export { toggleTheme };