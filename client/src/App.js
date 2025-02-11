import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getAccessToken, getRefreshToken } from './utils/getTokens';
import PostDetails from '../src/pages/PostDetails/PostDetails';
import { refreshToken } from './redux/actions/auth.actions';
import { Routes, Route, Navigate } from 'react-router-dom';
import { handleScroll, scrollToTop } from './utils/scroll';
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
    const darkMode = useTheme();

    const refreshTokenFromCookies = getRefreshToken();
    const accessToken = getAccessToken();

    useEffect(() => {
        if (!accessToken && refreshTokenFromCookies) {
            dispatch(refreshToken(refreshTokenFromCookies));
        }
    }, [accessToken, dispatch]);

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
                    <Route path="/posts/:id" element={<PostDetails />} />
                    <Route path="/posts" element={<Home />} />
                    <Route path="/auth" element={!accessToken ? <Auth /> : <Navigate to="/posts" />} />
                    <Route path="user/i" element={<Userinfo />} />;
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
            </Container>
        </div>
    );
};

export default App;
