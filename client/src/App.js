import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PostDetails from './components/PostDetails/PostDetails';
import NotFound from './components/Notfound/NotFound';
import Userinfo from './components/Userinfo/Userinfo';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import { Container } from '@mui/material';
import React from 'react';
import './App.css';

const App = () => {

    const user = JSON.parse(localStorage.getItem('profile'));

    return (
        <BrowserRouter>
            <Container maxWidth="xl">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Navigate to="/posts" />} />
                    <Route path="/posts/search" element={<Home />} />
                    <Route path="/posts/:id" element={<PostDetails />} />
                    <Route path="/posts" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/user/info/:id" element={<Userinfo />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Container>
        </BrowserRouter>
    );
}

export default App;
