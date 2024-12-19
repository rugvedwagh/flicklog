import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from 'react-redux';
import { reducers } from './reducers';
import { thunk } from 'redux-thunk'; // Removed curly braces around thunk
import ReactDOM from "react-dom/client"; // Updated import for React 18+
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import React from "react";
import App from "./App";

const store = createStore(reducers, compose(applyMiddleware(thunk)));
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
);
