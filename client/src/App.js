import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { isAccessTokenExpired } from './utils/checkTokenExpiry';
import { handleScroll, scrollToTop } from './utils/scroll';
import { Logout, clearError, clearSuccess, refreshToken } from './redux/actions/auth.actions';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Collapse, Container, Alert } from '@mui/material';
import { getAccessToken } from './utils/getTokens';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { useTheme } from './context/themeContext';
import { fetchUserProfile } from './utils/storage';
import { store } from './redux/store';
import Home from '../src/pages/Home/Home';
import Auth from '../src/pages/Auth/Auth';
import PostDetails from '../src/pages/PostDetails/PostDetails';
import NotFound from '../src/pages/Notfound/NotFound';
import Userinfo from '../src/pages/Userinfo/Userinfo';

import './App.css';

const App = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const darkMode = useTheme();
    const profile = fetchUserProfile();
    const welcomeRef = useRef(false);

    const { accessToken } = useSelector((state) => state.authReducer);
    const { errorMessage, successMessage } = useSelector((state) => state.authReducer);

    const [showScrollButton, setShowScrollButton] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [show, setShow] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);

    const isValidErrorAlertCondition = errorMessage && show && !errorMessage?.includes("Token");

    // --- Show error alert ---
    useEffect(() => {
        if (!errorMessage) return;

        setShow(true);
        const timer = setTimeout(() => {
            setShow(false);
            dispatch(clearError());
        }, 5000);

        return () => clearTimeout(timer);
    }, [errorMessage]);

    // --- Show success alert ---
    useEffect(() => {
        if (!successMessage) return;

        setShowSuccess(true);
        const timer = setTimeout(() => {
            setShowSuccess(false);
            dispatch(clearSuccess());
        }, 5000);

        return () => clearTimeout(timer);
    }, [successMessage]);

    // --- Refresh access token if missing or expired ---
    useEffect(() => {
        const refreshAccessTokenIfNeeded = async () => {

            if (isAccessTokenExpired(accessToken)) {
                await dispatch(refreshToken());

                setTimeout(() => {
                    const updatedToken = getAccessToken(store.getState());
                    if (!updatedToken || isAccessTokenExpired(updatedToken)) {
                        dispatch(Logout());
                    }
                }, 0);
            }
        };

        refreshAccessTokenIfNeeded();
    }, [accessToken, dispatch, navigate]);

    // --- Scroll-to-top button logic ---
    useEffect(() => {
        const onScroll = handleScroll(setShowScrollButton);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // --- Welcome message only once per session ---
    useEffect(() => {
        const hasShownWelcome = sessionStorage.getItem('welcomeShown');

        if (!hasShownWelcome && profile?.name) {
            setShowWelcome(true);
            sessionStorage.setItem('welcomeShown', 'true');
            welcomeRef.current = true;

            const timer = setTimeout(() => setShowWelcome(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [profile?.name]);

    return (
        <div className={`root-bg ${darkMode ? 'dark' : ''}`}>
            {/* Success Message */}
            <Collapse in={showSuccess}>
                <Alert variant="filled" severity="success" style={{ textAlign: 'center' }}>
                    {successMessage}
                </Alert>
            </Collapse>

            {/* Error Message */}
            <Collapse in={isValidErrorAlertCondition}>
                <Alert variant="filled" severity="error" style={{ textAlign: 'center' }}>
                    {errorMessage}
                </Alert>
            </Collapse>

            {/* Welcome Message */}
            <Collapse in={showWelcome}>
                <Alert variant="filled" icon={false} severity="success">
                    Welcome back, <strong>
                        {profile?.name?.charAt(0).toUpperCase() + profile?.name?.slice(1).toLowerCase()}
                    </strong>
                </Alert>
            </Collapse>

            <Container maxWidth="lg">
                {/* Scroll to Top Button */}
                <KeyboardArrowUpIcon
                    className={showScrollButton ? 'scrollup show' : 'scrollup hide'}
                    onClick={scrollToTop}
                />

                {/* Navigation */}
                <Navbar />

                {/* Routes */}
                <Routes>
                    <Route path="/" element={<Navigate to="/posts" />} />
                    <Route path="/posts/search" element={<Home />} />
                    <Route path="/posts/:id" element={<PostDetails />} />
                    <Route path="/posts" element={<Home />} />
                    <Route path="/auth" element={!accessToken ? <Auth /> : <Navigate to="/posts" />} />
                    <Route path="/user/i" element={<Userinfo />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>

                <Footer />
            </Container>
        </div>
    );
};

export default App;
