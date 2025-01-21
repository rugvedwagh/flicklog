import { combineReducers } from "redux";
import authReducer from "./reducers/auth.reducer";
import postsReducer from "./reducers/post.reducer";
import themeReducer from "./reducers/theme.reducer";

export const reducers = combineReducers(
    {
        postsReducer,
        authReducer,
        themeReducer
    }
);