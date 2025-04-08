import { Container, Grid, AppBar } from '@mui/material';
import { useTheme } from '../../context/themeContext';
import Search from '../../components/Search/Search';
import React, { useState, useEffect } from 'react';
import { getProfile } from '../../utils/storage';
import Posts from '../../components/Posts/Posts';
import { useLocation } from 'react-router-dom';
import Form from '../../components/Form/Form';
import './home.styles.css';

const Home = () => {

    const location = useLocation();
    const darkMode = useTheme();

    const [currentId, setCurrentId] = useState(0);
    const [formOpen, setformOpen] = useState(false);

    const profile = getProfile();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const handleDrop = () => {
        setformOpen(true);
    }

    return (
        <Container maxWidth='xl' disableGutters style={{ marginTop: '1.4rem' }}>

            <Grid container justify="space-between" alignItems="stretch" spacing={3} className='gridContainer'>
                <Grid item xs={12} sm={6} md={9}>
                    <Posts setCurrentId={setCurrentId} darkMode={darkMode} />
                </Grid>

                <Grid item xs={12} sm={4} md={3} className='utitlity-comps'>

                    <Search darkMode={darkMode} />

                    <AppBar className={`appBarSearch ${darkMode ? 'dark' : ''}`} elevation={6} position='static' >
                        {!formOpen && profile ? (
                            <h4 onClick={handleDrop}>Want to share something?</h4>
                        ) : (
                            <div className='blurbg'>
                                <Form className='form' darkMode={darkMode} currentId={currentId} setCurrentId={setCurrentId} setformOpen={setformOpen} />
                            </div>
                        )}
                    </AppBar>
                    <AppBar className={`coming-soon ${darkMode ? 'dark' : ''}`} elevation={6} position='static' >
                        <h4>
                            Coming soon...
                        </h4>
                    </AppBar>
                </Grid>
            </Grid>

        </Container>
    )
}

export default Home;