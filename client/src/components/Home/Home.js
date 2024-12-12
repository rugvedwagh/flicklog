import { Container, Grow, Grid, Paper, AppBar, TextField, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPostsBySearch } from '../../actions/posts';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Posts from '../Posts/Posts';
import Paginate from '../Paginate';
import Form from '../Form/Form';
import './styles.css'

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

const Home = () => {

    const [currentId, setCurrentId] = useState(null);
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState('');
    const [formOpen, setformOpen] = useState(false);
    const dispatch = useDispatch();
    const query = useQuery();   //usequery will search in the url 
    const page = query.get('page') || 1;
    const searchQuery = query.get('serchQuery')
    const user = JSON.parse(localStorage.getItem('profile'))
    const navigate = useNavigate();

    const handleDrop = () => {
        setformOpen(true);
    }

    const searchPost = () => {
        if (search.trim() || tags) {
            dispatch(getPostsBySearch({ search, tags }))
            navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags}`);
        }
        else {
            navigate('/');
        }
    }

    return (
        <Grow in>
            <Container maxWidth='xl'>
                <Grid container justify="space-between" alignItems="stretch" spacing={3} className='gridContainer'>
                    <Grid item xs={12} sm={6} md={9}>
                        <Posts setCurrentId={setCurrentId} />
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                        <AppBar className='appBarSearch' position='static' color='inherit'>
                            <TextField
                                style={{ margin: '10px 0 0 0' }}
                                name='search'
                                variant='outlined'
                                label='Search Memories'
                                fullWidth
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <TextField
                                style={{ margin: '10px 0 10px 0' }}
                                name='search'
                                variant='outlined'
                                label='Search Tags'
                                fullWidth
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                            <Button onClick={searchPost} variant='contained' className='searchButton' fullWidth style={{ margin: "0 10px", backgroundColor: 'black' }}>
                                Search
                            </Button>
                        </AppBar>
                        <Paper elevation={6} >
                            <Paginate page={page} />
                        </Paper>
                        {!formOpen && user ? (
                            <div className='temp' onClick={handleDrop}>
                                Want to share something?
                            </div>
                        ) : (
                            <Form currentId={currentId} setCurrentId={setCurrentId} setformOpen={setformOpen} />
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Grow>

    )
}

export default Home