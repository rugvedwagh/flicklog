import React, { useState, useEffect, useCallback, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Grid, CircularProgress, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../../actions/post.action.js';
import Post from './Post/Post.js';
import './posts.styles.css';

const Posts = ({ setCurrentId, Myposts, darkMode }) => {
    
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const userId = user?.result?._id;
    
    const { posts, isLoading, numberOfPages } = useSelector((state) => state.postsReducer);

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(getPosts(currentPage));
    }, [currentPage, dispatch]);

    const userPosts = useMemo(() => {
        if (user && Myposts) {
            return posts?.filter((post) => post.creator === userId);
        }
        return posts;
    }, [user, Myposts, posts, userId]);

    const fetchMorePosts = useCallback(() => {
        if (currentPage < numberOfPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    }, [currentPage, numberOfPages]);

    return (
        <div style={{ overflow: 'hidden' }} >
            {isLoading && currentPage === 1 ? (
                <CircularProgress className={`loading ${darkMode ? 'dark' : ''}`} size="3rem" color="grey" />
            ) : (
                <InfiniteScroll
                    dataLength={userPosts.length}
                    next={fetchMorePosts}
                    hasMore={currentPage < numberOfPages}
                    loader={<CircularProgress className={`infloader ${darkMode ? 'dark' : ''}`} sx={{color:'white'}} size="3rem" />}
                    endMessage={
                            <Typography className={`endmsg ${darkMode ? 'dark' : ''}`} variant='h5' align='center' > No more posts!</Typography>
                    }
                    style={{ overflowX: 'hidden' }}
                >
                    <Grid className="container" container alignItems="stretch" spacing={4}>
                        {userPosts.map((post) => (
                            <Grid key={post._id} item xs={12} sm={6} lg={4}>
                                <Post post={post} setCurrentId={setCurrentId} darkMode={darkMode}/>
                            </Grid>
                        ))}
                    </Grid>
                </InfiniteScroll>
            )}
        </div>
    );
};

export default Posts;
