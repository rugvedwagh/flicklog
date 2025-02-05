import {
    TOGGLE_THEME
} from "../../constants/theme.constants";

const initialState = {
    darkMode: true,
}

const themeReducer = (state = initialState, action) => {

    switch (action.type) {

        case TOGGLE_THEME:
            return {
                darkMode: !state.darkMode
            };

        default:
            return state;
    }
}

export default themeReducer;