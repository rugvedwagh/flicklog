import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import { combineReducers } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./reducers/auth.reducers";
import postsReducer from "./reducers/post.reducers";
import themeReducer from "./reducers/theme.reducers";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["posts"], 
};

const rootReducer = combineReducers({
    postsReducer: persistReducer(persistConfig, postsReducer), 
    authReducer,
    themeReducer
});

const store = createStore(
    rootReducer,
    compose(applyMiddleware(thunk))
);

const persistor = persistStore(store);

export { store, persistor };
