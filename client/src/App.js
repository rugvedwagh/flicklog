import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PostDetails from '../src/pages/PostDetails/PostDetails';
import { refreshToken } from './redux/actions/auth.actions';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import NotFound from '../src/pages/Notfound/NotFound';
import Userinfo from '../src/pages/Userinfo/Userinfo';
import React, { useEffect, useState } from 'react';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import { Container } from '@mui/material';
import Home from '../src/pages/Home/Home';
import Auth from '../src/pages/Auth/Auth';
import Cookies from 'js-cookie'
import './App.css';

const App = () => {
    const dispatch = useDispatch();

    const [showScrollButton, setShowScrollButton] = useState(false);
    const { darkMode } = useSelector((state) => state.themeReducer);

    const profile = JSON.parse(localStorage.getItem('profile'));
    const refreshTokenFromCookies = Cookies.get('refreshToken');

    useEffect(() => {
        if (!profile?.token && refreshTokenFromCookies) {
            dispatch(refreshToken(refreshTokenFromCookies));
        }
    }, [profile?.token, dispatch]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const scrollThreshold = 200;

            if (scrollY > scrollThreshold) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className={`root-bg ${darkMode ? 'dark' : ''}`} style={{ overflowX: 'hidden' }}>
            <Container maxWidth="xl">
                <KeyboardArrowUpIcon
                    className={showScrollButton ? 'scrollup show' : 'scrollup hide'}
                    onClick={scrollToTop}
                />
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
