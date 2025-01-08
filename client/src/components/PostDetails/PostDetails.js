import { Typography, CircularProgress, Divider, Card, Button } from '@mui/material';
import { getPost, getPostsBySearch } from '../../actions/posts';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState, useCallback } from 'react';
import CommentsSection from '../Comments/CommentsSection';
import moment from 'moment';
import './postdetail.css';

const PostDetails = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [vertical, setVertical] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [postLoaded, setPostLoaded] = useState(false);

    const { post, posts, isLoading } = useSelector((state) => state.postsReducer);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(getPost(id));
    }, [id, dispatch]);

    useEffect(() => {
        if (post) {
            dispatch(getPostsBySearch({ search: 'none', tags: post?.tags.join(',') }));
            setPostLoaded(true);
        }
    }, [post]);

    const toggleView = useCallback(() => setVertical(prev => !prev), console.log(vertical), []);
    const openPost = useCallback((_id) => navigate(`/posts/${_id}`), [navigate]);
    const handleImageClick = useCallback(() => setIsFullScreen(prev => !prev), []);

    if (!isLoading && !postLoaded) {
        return <CircularProgress className='loader' color='grey' size='4rem' />;
    }

    if (!post) return null;

    const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

    return (
        <div sx={{ paddingTop: '1.25rem' }}>

            <Button onClick={toggleView} class='verticalbutton'>
                toggle <br /> view
            </Button>

            <div className={`main ${vertical ? 'altview' : ''}`}>
                <div className='second'>
                    <img
                        className={`imag ${isFullScreen ? 'fullscreen' : ''}`}
                        src={post.selectedfile}
                        alt=''
                        onClick={handleImageClick}
                    />
                </div>

                <div className={`first ${vertical ? 'alt' : ''}`}>
                    <Typography className={`posttitle ${vertical ? 'alt' : ''}`} >
                        {post.title}
                    </Typography>

                    <Typography variant='subtitle1' className={`post-meta ${vertical ? 'dark' : ''}`}>
                        {post.tags.map((tag) => `#${tag} `)}
                    </Typography>

                    <Typography component='p' className='postmessage' dangerouslySetInnerHTML={{ __html: post.message }} />

                    <Typography variant='body1' className={`post-meta ${vertical ? 'dark' : ''}`}>
                        Posted by: {post.name}
                    </Typography>

                    <Typography variant='body1' className={`post-meta ${vertical ? 'dark' : ''}`}>
                        {moment(post.createdAt).fromNow()}
                    </Typography>

                    <CommentsSection darkmode={vertical} post={post} />
                </div>
            </div>

            {recommendedPosts.length ? (
                <div className='sect'>
                    <Typography gutterBottom variant='h5' sx={{ color: '#1a1a1a' }}>
                        You might also like
                    </Typography>
                    <Divider color='black' />
                    <div className='recommended-posts'>
                        {recommendedPosts.map(({ title, likes, selectedfile, _id }) => (
                            <Card className='recommended-post' onClick={() => openPost(_id)} key={_id}>
                                <Typography gutterBottom variant='h6'>{title}</Typography>
                                <img
                                    src={selectedfile}
                                    class='recimg'
                                    alt='alt.img'
                                    onClick={() => openPost(_id)}
                                />
                                <Typography gutterBottom variant='subtitle1'>{likes.length} likes</Typography>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (

                isLoading
                    ? (
                        <CircularProgress className='loader' color='grey' size='4rem' />
                    ) :
                    (
                        <Typography variant='h5' color="white" align='center' sx={{ mt: '2rem' }} > No related posts!</Typography>
                    )
            )}
        </div>
    );
};

export default PostDetails;
