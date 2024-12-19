import { Container, Grow, Grid, Paper, TextField, AppBar, ToggleButtonGroup, ToggleButton } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useNavigate } from 'react-router-dom';
import { getPostsBySearch } from '../../actions/posts';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import './styles.css';

const Home = () => {
    const [currentId, setCurrentId] = useState(null);
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState('');
    const [formOpen, setformOpen] = useState(false);
    const [myposts, setMyposts] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));

    const handleDrop = () => {
        setformOpen(true);
    }

    const searchPost = () => {
        if (search.trim() || tags) {
            dispatch(getPostsBySearch({ search, tags }))
            navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags || 'none'}`);
        }
        else {
            navigate('/');
        }
    }

    const handleSwitch = () => {
        setMyposts(!myposts);
    }

    return (
        <Grow in>
            <Container maxWidth='xl'>
                <div className='toggle-container'>
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
                </div>
                <Grid container justify="space-between" alignItems="stretch" spacing={3} className='gridContainer'>
                    <Grid item xs={12} sm={6} md={9}>
                        <Posts setCurrentId={setCurrentId} Myposts={myposts} />
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                        <AppBar className='appBarSearch' position='static' color='inherit'>
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
                            <button className='button-28' onClick={searchPost}>
                                <SearchOutlinedIcon />
                            </button>
                        </AppBar>
                        {!formOpen && user ? (
                            <Paper className='temp' onClick={handleDrop}>
                                Want to share something?
                            </Paper>
                        ) : (
                            <Form currentId={currentId} setCurrentId={setCurrentId} setformOpen={setformOpen} />
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Grow>
    )
}

export default Home;
