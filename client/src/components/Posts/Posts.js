import { Grid, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import Post from './Post/Post';
import React from 'react';
import './styles.css';

const Posts = ({ setCurrentId }) => {

    const { posts, isLoading } = useSelector((state) => state.posts)

    if (!posts?.length && !isLoading) return (
        <div className='noposts'>
            No Posts available!
        </div>
    )
    
    return (
        isLoading ? <CircularProgress style={{ margin: '180px 50%', height: '75px', width: '75px', color: 'grey' }} /> : (
            <Grid className='container' container alignItems="stretch" spacing={4}>
                {posts.map((post) => (
                    <Grid key={post._id} item xs={12} sm={6} lg={4}>
                        <Post post={post} setCurrentId={setCurrentId} />
                    </Grid>
                ))}
            </Grid>
        )
    )
}

export default Posts