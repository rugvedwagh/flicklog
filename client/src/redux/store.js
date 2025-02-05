import { createStore, applyMiddleware, compose } from "redux";
import authReducer from "./reducers/auth.reducers";
import postsReducer from "./reducers/post.reducers";
import themeReducer from "./reducers/theme.reducers";
import { combineReducers } from "redux";
import { thunk } from 'redux-thunk';

const reducers = combineReducers({
    postsReducer,
    authReducer,
    themeReducer
});

const store = createStore(
    reducers,
    compose(applyMiddleware(thunk))
);

export default store;