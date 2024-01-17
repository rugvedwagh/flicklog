import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from 'react-redux';
import { reducers } from './reducers';
import { thunk } from 'redux-thunk'; 
import ReactDOM from "react-dom";
import React from "react";
import App from "./App";

const store = createStore(reducers, compose(applyMiddleware(thunk)));
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <App />
    </Provider>,
);
