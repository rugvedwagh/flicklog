import { TOGGLE_THEME } from "../../constants/theme.constants";
import { getStoredDarkMode, saveDarkMode } from "../../utils/theme";

const initialState = {
    darkMode: getStoredDarkMode(true), 
};

const themeReducer = (state = initialState, action) => {
    switch (action.type) {

        case TOGGLE_THEME:
            const newTheme = !state.darkMode;
            saveDarkMode(newTheme); 
            return { darkMode: newTheme };

        default:
            return state;
    }
};

export default themeReducer;
