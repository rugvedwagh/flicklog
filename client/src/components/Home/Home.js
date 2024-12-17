import { Container, Typography, Button, Grow, Grid, Paper, TextField, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPostsBySearch } from '../../actions/posts';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import './styles.css';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Home = () => {
    const [currentId, setCurrentId] = useState(null);
    const [search, setSearch] = useState('');
    const [formOpen, setformOpen] = useState(false);
    const [myposts, setMyposts] = useState(false);

    const dispatch = useDispatch();
    const query = useQuery();
    const page = query.get('page') || 1;
    const user = JSON.parse(localStorage.getItem('profile'));
    const navigate = useNavigate();


    const handleDrop = () => {
        setformOpen(true);
    };

    const handleSwitch = () => {
        setMyposts(!myposts);
    };

    const searchPost = () => {
        if (search.trim()) { //if search button is clicked and theres something entered in tags or search box
            console.log(search)
            dispatch(getPostsBySearch({search}));//pasiing the parameters newwded //everything sent is a string
            navigate(`/posts/search?searchQuery=${search || 'none'}`);
        } else {
            navigate(`/`)
        }
    }

    return (
        <Grow in>
            <Container maxWidth="xl">
                <div className="toggle-container">
                    <ToggleButtonGroup
                        value={myposts ? 'myPosts' : 'allPosts'}
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
                <Grid container justify="space-between" alignItems="stretch" spacing={3} className="gridContainer">
                    <Grid item xs={12} sm={6} md={9}>
                        <Posts setCurrentId={setCurrentId} Myposts={myposts} />
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                        <Paper className="appBarSearch">
                            <Typography gutterBottom variant='h6' align='center'>Search Event</Typography>
                            <TextField name='search' variant='outlined' label='Enter event title' fullWidth value={search} onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button color='primary' variant='contained' onClick={searchPost} style={{ marginTop: '10px' }}>Search</Button>
                        </Paper>
                        {!formOpen && user ? (
                            <Paper className="temp" onClick={handleDrop}>
                                <h4>Want to share something?</h4>
                            </Paper>
                        ) : (
                            <Form currentId={currentId} setCurrentId={setCurrentId} setformOpen={setformOpen} />
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Grow>
    );
};

export default Home;
