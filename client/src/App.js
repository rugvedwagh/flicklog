import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { isRefreshTokenExpired } from './utils/checkTokenExpiry';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PostDetails from '../src/pages/PostDetails/PostDetails';
import { handleScroll, scrollToTop } from './utils/scroll';
import { Logout } from './redux/actions/auth.actions';
import { getRefreshToken } from './utils/getTokens';
import NotFound from '../src/pages/Notfound/NotFound';
import Userinfo from '../src/pages/Userinfo/Userinfo';
import React, { useEffect, useState } from 'react';
import { useTheme } from './context/themeContext';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import { useDispatch } from 'react-redux';
import { Container } from '@mui/material';
import { Alert } from '@mui/material';
import Home from '../src/pages/Home/Home';
import Auth from '../src/pages/Auth/Auth';
import './App.css';
import { useSelector } from 'react-redux';

const App = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const location = useLocation();
    const darkMode = useTheme();

    const [refreshTokenFromCookies, setRefreshTokenFromCookies] = useState('');
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [show, setShow] = useState(true)

    const { errorMessage } = useSelector((state) => state.authReducer)

    const isRelevantErrorAlertCondition = errorMessage && show && location.pathname !== '/auth' && !errorMessage?.includes("Token");

    useEffect(() => {
        if (!errorMessage) return;

        setShow(true);

        const timer = setTimeout(() => {
            setShow(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [errorMessage, errorMessage?.length]);

    useEffect(() => {
        const fetchRefreshToken = async () => {
            const rft = await getRefreshToken();
            setRefreshTokenFromCookies(rft ?? null);
        };

        fetchRefreshToken();
    }, [location.pathname]);

    useEffect(() => {
        if (refreshTokenFromCookies === '') return;

        if (refreshTokenFromCookies === null) {
            dispatch(Logout(navigate));
            return;
        }

        const checkRefreshToken = async () => {
            if (!refreshTokenFromCookies || isRefreshTokenExpired(refreshTokenFromCookies)) {
                dispatch(Logout(navigate));
            }
        };

        checkRefreshToken();
    }, [refreshTokenFromCookies]);

    useEffect(() => {
        const onScroll = handleScroll(setShowScrollButton);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className={`root-bg ${darkMode ? 'dark' : ''}`}>
            {isRelevantErrorAlertCondition && (
                <Alert variant="filled" severity="error" style={{ textAlign: 'center' }}>
                    {errorMessage}
                </Alert>
            )}
            <Container maxWidth="lg">

                <KeyboardArrowUpIcon
                    className={showScrollButton ? 'scrollup show' : 'scrollup hide'}
                    onClick={scrollToTop}
                />

                <Navbar />

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
