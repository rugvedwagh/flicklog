import { isAccessTokenExpired, isRefreshTokenExpired } from './utils/checkTokenExpiry';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PostDetails from '../src/pages/PostDetails/PostDetails';
import { handleScroll, scrollToTop } from './utils/scroll';
import { Logout, refreshToken } from './redux/actions/auth.actions';
import { getAccessToken, getRefreshToken } from './utils/getTokens';
import NotFound from '../src/pages/Notfound/NotFound';
import Userinfo from '../src/pages/Userinfo/Userinfo';
import React, { useEffect, useState } from 'react';
import { useTheme } from './context/themeContext';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import { useDispatch } from 'react-redux';
import { Container } from '@mui/material';
import Home from '../src/pages/Home/Home';
import Auth from '../src/pages/Auth/Auth';
import './App.css';

const App = () => {

    const dispatch = useDispatch();

    const [showScrollButton, setShowScrollButton] = useState(false);
    const [userLoggedOut, setUserLoggedOut] = useState(false);
    const [refreshTokenFromCookies, setRefreshTokenFromCookies] = useState();

    const darkMode = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRefreshToken = async () => {
            const token = await getRefreshToken();
            setRefreshTokenFromCookies(token ?? null);
        };

        fetchRefreshToken();
    }, []);

    useEffect(() => {
        if (refreshTokenFromCookies === '') {
            return;
        }

        if (refreshTokenFromCookies === null) {
            setUserLoggedOut(true);
            dispatch(Logout(navigate));
            return;
        }

        const checkAuth = async () => {

            const accessToken = getAccessToken();

            if (refreshTokenFromCookies && !isRefreshTokenExpired(refreshTokenFromCookies) && (accessToken && !isAccessTokenExpired(accessToken))) {
                setUserLoggedOut(false);
            }

            if ((!accessToken || isAccessTokenExpired(accessToken)) && refreshTokenFromCookies) {
                setUserLoggedOut(false);
                dispatch(refreshToken(refreshTokenFromCookies));
            }
            else if (refreshTokenFromCookies && isRefreshTokenExpired(refreshTokenFromCookies) && userLoggedOut) {
                setUserLoggedOut(true);
                dispatch(Logout(navigate));
            }
        };
    
        checkAuth();
    
        const interval = setInterval(checkAuth, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, [refreshTokenFromCookies]);

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
                    <Route path="/auth" element={userLoggedOut ? <Auth /> : <Navigate to="/posts" />} />
                    <Route path="user/i" element={<Userinfo />} />;
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />

            </Container>
        </div>
    );
};

export default App;
