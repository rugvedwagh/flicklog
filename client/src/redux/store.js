import { createStore, applyMiddleware, compose } from "redux";
import { persistStore } from "redux-persist";
import { thunk } from "redux-thunk"; 
import rootReducer from "./reducers/index";

const store = createStore(
    rootReducer, 
    compose(applyMiddleware(thunk))
);

const persistor = persistStore(store);

export { store, persistor };
