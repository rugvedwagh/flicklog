import React, { useState, useEffect, useCallback } from 'react';
import { Grid, CircularProgress, Typography } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../../redux/actions/post.actions.js';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/themeContext.js';
import Post from '../Post/Post'
import './posts.styles.css';

const Posts = ({ setCurrentId }) => {

    const dispatch = useDispatch();
    const location = useLocation();
    const darkMode = useTheme()

    const { posts, isLoading, numberOfPages } = useSelector((state) => state.postsReducer);

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchPosts(currentPage));
    }, [currentPage, dispatch, location]);

    const fetchMorePosts = useCallback(() => {
        if (currentPage < numberOfPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    }, [currentPage, numberOfPages]);

    return (
        <div>
            {isLoading && currentPage === 1 ? (
                <CircularProgress
                    className={`loading ${darkMode ? 'dark' : ''}`}
                    size="3rem"
                    color="grey"
                />
            ) : (
                <InfiniteScroll
                    dataLength={posts.length}
                    next={fetchMorePosts}
                    hasMore={currentPage < numberOfPages}
                    loader={
                        <CircularProgress
                            className={`infloader ${darkMode ? 'dark' : ''}`}
                            size="3rem"
                        />
                    }
                    endMessage={
                        <Typography
                            className={`endmsg ${darkMode ? 'dark' : ''}`}
                            variant='h5'
                            align='center'
                        >
                            No more posts!
                        </Typography>
                    }
                    style={{ overflowX: 'hidden' }}
                >
                    <Grid
                        className="container"
                        container
                        alignItems="stretch"
                        spacing={4}
                    >
                        {posts.map((post) => (
                            <Grid key={post._id} item xs={12} sm={6} lg={4}>
                                <Post post={post} setCurrentId={setCurrentId} darkMode={darkMode} />
                            </Grid>
                        ))}
                    </Grid>
                </InfiniteScroll>
            )}
        </div>
    );
};

export default Posts;
