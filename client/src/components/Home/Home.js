import { Container, Grow, Grid, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getPosts } from '../../actions/posts';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Posts from '../Posts/Posts';
import Paginate from '../Paginate';
import Form from '../Form/Form';

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

const Home = () => {

    const [currentId, setCurrentId] = useState(null);
    const dispatch = useDispatch();

    const query = useQuery();   //usequery will search in the url 
    const page = query.get('page') || 1;
    
    useEffect(() => {
        dispatch(getPosts());
    }, [currentId, dispatch])

    return (
        <Grow in>
            <Container>
                <Grid className="mainContainer" container justify="space-between" alignItems="stretch" spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Posts setCurrentId={setCurrentId} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper className='paginatio' elevation={6}>
                            <Paginate page={page} />
                        </Paper>
                        <Form currentId={currentId} setCurrentId={setCurrentId} />
                    </Grid>
                </Grid>
            </Container>
        </Grow>
    )
}

export default Home