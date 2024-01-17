import { combineReducers } from "redux";
import authReducer from "./auth";
import posts from './posts'

export const reducers = combineReducers({ posts, authReducer });