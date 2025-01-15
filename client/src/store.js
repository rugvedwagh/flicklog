import { combineReducers } from "redux";
import userReducer from "./reducers/auth";
import postsReducer from "./reducers/posts";
import themeReducer from "./reducers/theme";

export const reducers = combineReducers(
    {
        postsReducer,
        userReducer,
        themeReducer
    }
);