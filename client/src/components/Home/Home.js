import { Container, Grid, Paper, TextField, AppBar, ToggleButtonGroup, ToggleButton } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPostsBySearch } from '../../actions/posts';
import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import './home.css';

const Home = ({darkMode}) => {
    const [currentId, setCurrentId] = useState(null);
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState('');
    const [formOpen, setformOpen] = useState(false);
    const [myposts, setMyposts] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
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

    const handleSearchPost = () => {
        if (search.trim() || tags) {
            dispatch(getPostsBySearch({ search, tags }))
            navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags || 'none'}`);
        }
        else {
            navigate('/');
        }
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
                    <strong>All Posts</strong>
                </ToggleButton>

                <ToggleButton value="myPosts" aria-label="my posts">
                    <strong>My Posts</strong>
                </ToggleButton>

            </ToggleButtonGroup>

            <Grid container justify="space-between" alignItems="stretch" spacing={3} className='gridContainer'>
                <Grid item xs={12} sm={6} md={9}>
                    <Posts setCurrentId={setCurrentId} Myposts={myposts} darkMode={darkMode} />
                </Grid>

                <Grid item xs={12} sm={4} md={3}>
                    <AppBar className={`appBarSearch ${darkMode ? 'dark' : ''}`} position='static'>
                        <TextField
                            name='search'
                            variant='filled'
                            label='Search Memories'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <TextField
                            name='search'
                            variant='filled'
                            label='Search Tags'
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                        
                        <button className={`button-28 ${darkMode ? 'dark' : ''}`} onClick={handleSearchPost}>
                            <SearchOutlinedIcon />
                        </button>
                    </AppBar>

                    {!formOpen && user ? (
                        <Paper className={`form-heading ${darkMode ? 'dark' : ''}`} onClick={handleDrop}>
                            <h4>Want to share something?</h4>
                        </Paper>
                    ) : (

                        <Form className='form' darkMode={darkMode} currentId={currentId} setCurrentId={setCurrentId} setformOpen={setformOpen} />
                    )}

                </Grid>
            </Grid>

        </Container>
    )
}

export default Home;
