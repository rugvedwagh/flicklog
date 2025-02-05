import { combineReducers } from "redux";
import authReducer from "./auth";
import postsReducer from "./posts";
import themeReducer from "./theme";

const reducers = combineReducers(
    {
        postsReducer,
        authReducer,
        themeReducer
    }
);

export default reducers;