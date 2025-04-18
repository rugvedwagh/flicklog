import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { isAccessTokenExpired, isRefreshTokenExpired } from './utils/checkTokenExpiry';
import { refreshToken } from './redux/actions/auth.actions';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PostDetails from '../src/pages/PostDetails/PostDetails';
import { handleScroll, scrollToTop } from './utils/scroll';
import { Logout, clearError } from './redux/actions/auth.actions';
import { getRefreshToken } from './utils/getTokens';
import NotFound from '../src/pages/Notfound/NotFound';
import Userinfo from '../src/pages/Userinfo/Userinfo';
import React, { useEffect, useState } from 'react';
import { useTheme } from './context/themeContext';
import { fetchUserProfile } from './utils/storage';
import Footer from './components/Footer/Footer';
import { useRef } from 'react';
import { Collapse } from '@mui/material';
import Navbar from './components/Navbar/Navbar';
import { useDispatch } from 'react-redux';
import { Container } from '@mui/material';
import { Alert } from '@mui/material';
import Home from '../src/pages/Home/Home';
import Auth from '../src/pages/Auth/Auth';
import { useSelector } from 'react-redux';
import './App.css';

const App = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const profile = fetchUserProfile();
    const location = useLocation();
    const darkMode = useTheme();

    const [showScrollButton, setShowScrollButton] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [refreshTokenFromCookies, setrefreshTokenFromCookies] = useState('');
    const [show, setShow] = useState(true);
    const welcomeRef = useRef(false);

    let { errorMessage } = useSelector((state) => state.authReducer)
    const accessToken = useSelector(state => state.authReducer.accessToken);

    const isValidErrorAlertCondition = errorMessage && show && !errorMessage?.includes("Token");

    useEffect(() => {
        if (!errorMessage) return;

        setShow(true);

        const timer = setTimeout(() => {
            setShow(false);
            dispatch(clearError());
        }, 5000);

        return () => clearTimeout(timer);
    }, [errorMessage]);

    useEffect(() => {
        const fetchrefreshTokenFromCookies = async () => {
            const rft = await getRefreshToken();
            setrefreshTokenFromCookies(rft ?? null);
        };

        fetchrefreshTokenFromCookies();
    }, [location.pathname]);

    useEffect(() => {
        if (refreshTokenFromCookies === '') return;

        if (refreshTokenFromCookies === null) {
            dispatch(Logout(navigate));
            return;
        }

        if (!refreshTokenFromCookies || isRefreshTokenExpired(refreshTokenFromCookies)) {
            dispatch(Logout(navigate));
        }

    }, [refreshTokenFromCookies]);

    useEffect(() => {
        const checkAccessToken = async () => {
            if (!accessToken || isAccessTokenExpired(accessToken)) {
                await dispatch(refreshToken());
            }
        };

        checkAccessToken();

        const interval = setInterval(checkAccessToken, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, [accessToken]);

    useEffect(() => {
        const onScroll = handleScroll(setShowScrollButton);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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
            <Collapse in={isValidErrorAlertCondition}>
                <Alert variant="filled" severity="error" style={{ textAlign: 'center' }}>
                    {errorMessage}
                </Alert>
            </Collapse>
            <Collapse in={showWelcome}>
                <Alert variant="filled" icon={false} severity="success">
                    Welcome back, <strong>
                        {profile?.name?.charAt(0).toUpperCase() + profile?.name?.slice(1).toLowerCase()}
                    </strong>
                </Alert>
            </Collapse>

            <Container maxWidth="lg">

                <KeyboardArrowUpIcon
                    className={showScrollButton ? 'scrollup show' : 'scrollup hide'}
                    onClick={scrollToTop}
                />

                <Navbar refreshTokenFromCookies={refreshTokenFromCookies} />

                <Routes>
                    <Route path="/" element={<Navigate to="/posts" />} />
                    <Route path="/posts/search" element={<Home />} />
                    <Route path="/posts/:id" element={<PostDetails />} />
                    <Route path="/posts" element={<Home />} />
                    <Route path="/auth" element={!refreshTokenFromCookies ? <Auth /> : <Navigate to="/posts" />} />
                    <Route path="user/i" element={<Userinfo />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>

                <Footer />
            </Container>
        </div >
    );
};

export default App;
