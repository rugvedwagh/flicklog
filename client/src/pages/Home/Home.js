import { Container, Grid, AppBar, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Search from '../../components/Search/Search';
import React, { useState, useEffect } from 'react';
import Posts from '../../components/Posts/Posts';
import Form from '../../components/Form/Form';
import './home.styles.css';

const Home = ({ darkMode }) => {

    
    const location = useLocation();

    const [currentId, setCurrentId] = useState(null);
    const [formOpen, setformOpen] = useState(false);
    const [myposts, setMyposts] = useState(false);

    const user = JSON.parse(localStorage.getItem('profile'));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const handleDrop = () => {
        setformOpen(true);
    }

    const handleSwitch = () => {
        setMyposts(!myposts);
    }

    return (
        <Container maxWidth='xl' style={{ marginTop: '5.5rem' }}>

            <ToggleButtonGroup
                value={myposts ? "myPosts" : "allPosts"}
                exclusive
                onChange={handleSwitch}
                aria-label="post toggle"
            >
                <ToggleButton value="allPosts" aria-label="all posts">
                    All Posts
                </ToggleButton>

                <ToggleButton value="myPosts" aria-label="my posts">
                    My Posts
                </ToggleButton>

            </ToggleButtonGroup>

            <Grid container justify="space-between" alignItems="stretch" spacing={3} className='gridContainer'>
                <Grid item xs={12} sm={6} md={9}>
                    <Posts setCurrentId={setCurrentId} Myposts={myposts} darkMode={darkMode} />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>

                    <Search darkMode={darkMode}/>

                    <AppBar className={`appBarSearch ${darkMode ? 'dark' : ''}`} elevation={6} position='static' >
                        {!formOpen && user ? (
                            <h4 onClick={handleDrop}>Want to share something?</h4>
                        ) : (
                            <Form className='form' darkMode={darkMode} currentId={currentId} setCurrentId={setCurrentId} setformOpen={setformOpen} />
                        )}
                    </AppBar>
                </Grid>
            </Grid>

        </Container>
    )
}

export default Home;
