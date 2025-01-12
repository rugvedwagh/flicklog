import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PostDetails from '../src/pages/PostDetails/PostDetails';
import { Routes, Route, Navigate } from 'react-router-dom';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NotFound from '../src/pages/Notfound/NotFound';
import Userinfo from '../src/pages/Userinfo/Userinfo';
import React, { useEffect, useState } from 'react';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import { Container } from '@mui/material';
import Home from '../src/pages/Home/Home';
import Auth from '../src/pages/Auth/Auth';
import { Button } from '@mui/material'
import './App.css';

const App = () => {
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const user = JSON.parse(localStorage.getItem('profile'));

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

    return (
        <div className={`root-bg ${darkMode ? 'dark' : ''}`} style={{ overflowX: 'hidden' }}>
            <Button onClick={toggleView} class='verticalbutton'>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon sx={{ color: 'black' }} />}
            </Button>
            <Container maxWidth="xl">
                <KeyboardArrowUpIcon className={showScrollButton ? 'scrollup show' : 'scrollup hide'} onClick={scrollToTop} />
                <Navbar darkMode={darkMode} />

                <Routes>
                    <Route path="/" element={<Navigate to="/posts" />} />
                    <Route path="/posts/search" element={<Home darkMode={darkMode} />} />
                    <Route path="/posts/:id" element={<PostDetails darkMode={darkMode} />} />
                    <Route path="/posts" element={<Home darkMode={darkMode} />} />
                    <Route path="/auth" element={user ? <Navigate to="/posts" /> : <Auth darkMode={darkMode} />} />
                    <Route path="/user/i" element={<Userinfo darkMode={darkMode} />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>

            </Container>
            <Footer darkMode={darkMode} />
        </div>
    );
};

export default App;
