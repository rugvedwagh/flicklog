import { Grid, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import Post from './Post/Post';
import React from 'react';
import './styles.css';

const Posts = ({ setCurrentId, Myposts }) => {
    const { posts, isLoading } = useSelector((state) => state.posts);
    const user = JSON.parse(localStorage.getItem('profile'));
    const userId = user?.result?._id;
    
    console.log(user)
    // Check if user is available before attempting to filter posts
    const userPosts = user && Myposts
        ? posts?.filter((post) => post.creator === userId)
        : posts;

    if (isLoading) {
        return <CircularProgress className='loading' size='4rem' color='grey' />;
    }

    if (!userPosts?.length) {
        return (
            <div className='noposts'>
                No posts available!
            </div>
        );
    }

    return (
        <Grid className='container' container alignItems="stretch" spacing={4}>
            {userPosts.map((post) => (
                <Grid key={post._id} item xs={12} sm={6} lg={4}>
                    <Post post={post} setCurrentId={setCurrentId} />
                </Grid>
            ))}
        </Grid>
    );
};

export default Posts;
