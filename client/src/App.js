import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getAccessToken, getRefreshToken } from './utils/getTokens';
import PostDetails from '../src/pages/PostDetails/PostDetails';
import { refreshToken } from './redux/actions/auth.actions';
import { Routes, Route, Navigate } from 'react-router-dom';
import { handleScroll, scrollToTop } from './utils/scroll';
import { useSelector, useDispatch } from 'react-redux';
import NotFound from '../src/pages/Notfound/NotFound';
import Userinfo from '../src/pages/Userinfo/Userinfo';
import React, { useEffect, useState } from 'react';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import { saveDarkMode } from './utils/theme';
import { Container } from '@mui/material';
import Home from '../src/pages/Home/Home';
import Auth from '../src/pages/Auth/Auth';
import './App.css';

const App = () => {

    const dispatch = useDispatch();

    const [showScrollButton, setShowScrollButton] = useState(false);
    const { darkMode } = useSelector((state) => state.themeReducer);

    const accessToken = getAccessToken();
    const refreshTokenFromCookies = getRefreshToken();

    useEffect(() => {
        saveDarkMode(darkMode);
    }, [darkMode]);

    useEffect(() => {
        saveDarkMode(darkMode);
    }, [darkMode]);

    useEffect(() => {
        if (!accessToken && refreshToken) {
            dispatch(refreshToken(refreshTokenFromCookies));
        }
    }, [accessToken, dispatch]);

    useEffect(() => {
        const onScroll = handleScroll(setShowScrollButton);
        window.addEventListener('scroll', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    return (
        <div className={`root-bg ${darkMode ? 'dark' : ''}`} style={{ overflowX: 'hidden' }}>
            <Container maxWidth="xl">
                <KeyboardArrowUpIcon
                    className={showScrollButton ? 'scrollup show' : 'scrollup hide'}
                    onClick={scrollToTop}
                />
                <Navbar darkMode={darkMode} />
                <Routes>
                    <Route path="/" element={<Navigate to="/posts" />} />
                    <Route path="/posts/search" element={<Home darkMode={darkMode} />} />
                    <Route path="/posts/:id" element={<PostDetails darkMode={darkMode} />} />
                    <Route path="/posts" element={<Home darkMode={darkMode} />} />
                    <Route path="/auth" element={<Auth darkMode={darkMode} />} />
                    <Route path="/user/i" element={<Userinfo darkMode={darkMode} />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Container>
            <Footer darkMode={darkMode} />
        </div>
    );
};

export default App;
