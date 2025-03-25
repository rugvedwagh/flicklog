import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from './context/themeContext';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import React from "react";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </BrowserRouter>
        </PersistGate>
    </Provider>,
);
