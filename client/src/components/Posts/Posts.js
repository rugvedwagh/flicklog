import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Grid, CircularProgress } from '@mui/material';
import { getPosts } from '../../actions/posts';
import Post from '../Post/Post.js'
import './styles.css';

const Posts = ({ setCurrentId, Myposts }) => {
    const dispatch = useDispatch();
    const { posts, isLoading, numberOfPages } = useSelector((state) => state.posts);
    const user = JSON.parse(localStorage.getItem('profile'));
    const userId = user?.result?._id;

    const [currentPage, setCurrentPage] = useState(1);

    const userPosts = user && Myposts
        ? posts?.filter((post) => post.creator === userId)
        : posts;

    useEffect(() => {
        dispatch(getPosts(currentPage));
    }, [currentPage, dispatch]);

    const fetchMorePosts = () => {
        if (currentPage < numberOfPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <div className='postscont'>
            {isLoading && currentPage === 1 ? (
                <CircularProgress className="loading" size="3rem" color="grey" />
            ) : (
                <InfiniteScroll
                    dataLength={userPosts.length}
                    next={fetchMorePosts}
                    hasMore={currentPage < numberOfPages}
                    loader={<CircularProgress size="3rem" style={{margin:'10px 50%', color:'white'}}/>}
                    endMessage={
                        <div style={{ textAlign: 'center', margin: '20px 0', color : 'white' }}>
                            <b>You're all caught up!</b>
                        </div>
                    }
                    style={{overflowX:'hidden'}}
                >
                    <Grid className="container" container alignItems="stretch" spacing={4}>
                        {userPosts.map((post) => (
                            <Grid key={post._id} item xs={12} sm={6} lg={4}>
                                <Post post={post} setCurrentId={setCurrentId} />
                            </Grid>
                        ))}
                    </Grid>
                </InfiniteScroll>
            )}
        </div>
    );
};

export default Posts;
