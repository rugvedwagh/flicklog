import { isAccessTokenExpired, isRefreshTokenExpired } from './utils/checkTokenExpiry';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PostDetails from '../src/pages/PostDetails/PostDetails';
import { handleScroll, scrollToTop } from './utils/scroll';
import { Logout, refreshToken } from './redux/actions/auth.actions';
import { getRefreshToken } from './utils/getTokens';
import NotFound from '../src/pages/Notfound/NotFound';
import Userinfo from '../src/pages/Userinfo/Userinfo';
import React, { useEffect, useState } from 'react';
import { useTheme } from './context/themeContext';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from '@mui/material';
import Home from '../src/pages/Home/Home';
import Auth from '../src/pages/Auth/Auth';
import './App.css';

const App = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const darkMode = useTheme();

    const accessToken = useSelector(state => state.authReducer.accessToken);

    const [showScrollButton, setShowScrollButton] = useState(false);
    const [refreshTokenFromCookies, setRefreshTokenFromCookies] = useState('');

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

    return (
        <div className={`root-bg ${darkMode ? 'dark' : ''}`}>
            <Container maxWidth="lg">
                <KeyboardArrowUpIcon
                    className={showScrollButton ? 'scrollup show' : 'scrollup hide'}
                    onClick={scrollToTop}
                />

                <Navbar />

                <Routes>
                    <Route path="/" element={<Navigate to="/posts" />} />
                    <Route path="/posts/search" element={<Home />} />
                    <Route path="/posts/:id" element={<PostDetails refreshToken={refreshToken} />} />
                    <Route path="/posts" element={<Home />} />
                    <Route path="/auth" element={!refreshTokenFromCookies ? <Auth /> : <Navigate to="/posts" />} />
                    <Route path="user/i" element={<Userinfo />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>

                <Footer />
            </Container>
        </div>
    );
};

export default App;
