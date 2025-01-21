import { combineReducers } from "redux";
import authReducer from "./auth";
import postsReducer from "./posts";
import themeReducer from "./theme";

export const reducers = combineReducers(
    {
        postsReducer,
        authReducer,
        themeReducer
    }
);