import { combineReducers } from "redux";
import userReducer from "./auth";
import postsReducer from "./posts";

export const reducers = combineReducers(
    {
        postsReducer,
        userReducer
    }
);