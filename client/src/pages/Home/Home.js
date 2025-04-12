import { Container, Grid, AppBar } from '@mui/material';
import { useTheme } from '../../context/themeContext';
import { useForm } from '../../context/formContext';
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
    const {formopen, setformopen} = useForm();
    console.log(formopen)

    const profile = getProfile();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <Container maxWidth='xl' disableGutters style={{ marginTop: '1.4rem' }}>

                {formopen && profile && (
                    <AppBar className={`appBarSearch ${darkMode ? 'dark' : ''}`} elevation={6} position='static' >
                            <div className='blurbg'>
                                <Form className='form' darkMode={darkMode} currentId={currentId} setCurrentId={setCurrentId} setformopen={setformopen} />
                            </div>
                    </AppBar>
                )}
            <Grid container justify="space-between" alignItems="stretch" spacing={3} className='gridContainer'>
                <Grid item xs={12} sm={9} md={12}>
                    <Posts setCurrentId={setCurrentId} darkMode={darkMode} />
                </Grid>
            </Grid>

        </Container>
    )
}

export default Home;