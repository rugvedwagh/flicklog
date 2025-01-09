import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PostDetails from './components/PostDetails/PostDetails';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotFound from './components/Notfound/NotFound';
import Userinfo from './components/Userinfo/Userinfo';
import React, { useEffect, useState } from 'react';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import { Container } from '@mui/material';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import { Button } from '@mui/material'
import './App.css';

const App = () => {
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    const user = JSON.parse(localStorage.getItem('profile'));
    const location = useLocation();

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

    const toggleView = () => setDarkMode(prev => !prev);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const backgroundClass = (() => {
        switch (location.pathname) {
            case '/posts':
                return 'posts-background';
            case '/auth':
                return 'auth-background';
            default:
                return 'user-background';
        }
    })();

    return (
        <div className={backgroundClass} style={{ overflowX: 'hidden' }}>
            <Button onClick={toggleView} class='verticalbutton'>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon sx={{ color: 'black' }} />}
            </Button>
            <Container maxWidth="xl">
                <ArrowUpwardRoundedIcon className={showScrollButton ? 'scrollup show' : 'scrollup hide'} onClick={scrollToTop} />
                
                <Navbar darkMode={darkMode} />

                <Routes>
                    <Route path="/" element={<Navigate to="/posts" />} />
                    <Route path="/posts/search" element={<Home darkMode={darkMode} />} />
                    <Route path="/posts/:id" element={<PostDetails darkMode={darkMode} />} />
                    <Route path="/posts" element={<Home darkMode={darkMode} />} />
                    <Route path="/auth" element={user ? <Navigate to="/posts" /> : <Auth />} />
                    <Route path="/user/i" element={<Userinfo />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>

            </Container>
            <Footer />
        </div>
    );
};

export default App;
