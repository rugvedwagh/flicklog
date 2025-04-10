import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Container, Grid, AppBar } from '@mui/material';
import { useTheme } from '../../context/themeContext';
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
        setformOpen(!formOpen);
    }

    return (
        <Container maxWidth='xl' disableGutters style={{ marginTop: '1.4rem' }}>

            <Grid container justify="space-between" alignItems="stretch" spacing={3} className='gridContainer'>
                <Grid item xs={12} sm={9} md={12}>
                    <AppBar className={`appBarSearch ${darkMode ? 'dark' : ''}`} elevation={6} position='static' >
                        {!formOpen && profile ? (
                            <h4 onClick={handleDrop}>&nbsp;Add New post</h4>
                        ) : (
                            <div className='blurbg'>
                                <Form className='form' darkMode={darkMode} currentId={currentId} setCurrentId={setCurrentId} setformOpen={setformOpen} />
                            </div>
                        )}
                    </AppBar>
                    <Posts setCurrentId={setCurrentId} darkMode={darkMode} />
                </Grid>
            </Grid>

        </Container>
    )
}

export default Home;