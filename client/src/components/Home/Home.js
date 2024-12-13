import { Container, Grow, Grid, Paper, AppBar, TextField, Button, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPostsBySearch } from '../../actions/posts';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import './styles.css';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Home = () => {
    const [currentId, setCurrentId] = useState(null);
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState('');
    const [formOpen, setformOpen] = useState(false);
    const [myposts, setMyposts] = useState(false);
    const dispatch = useDispatch();
    const query = useQuery();   //usequery will search in the url 
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');
    const user = JSON.parse(localStorage.getItem('profile'));
    const navigate = useNavigate();

    const handleDrop = () => {
        setformOpen(true);
    }

    const searchPost = () => {
        if (search.trim() || tags) {
            dispatch(getPostsBySearch({ search, tags }));
            navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags}`);
        } else {
            navigate('/');
        }
    }

    const handleSwitch = () => {
        setMyposts(!myposts);
        console.log(myposts);
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
                        <Paper className='appBarSearch'>
                            <TextField
                                name='search'
                                variant='outlined'
                                label='Search Posts'
                                fullWidth
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                size="small"  
                            />
                            <SearchIcon onClick={searchPost} className="searchlogo" sx={{ fontSize: 32 }} />
                        </Paper>
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
