import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import ReactDOM from "react-dom/client"; // Updated import for React 18+
import { Provider } from 'react-redux'; // Removed curly braces around thunk
import store from "./store";
import React from "react";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
);
