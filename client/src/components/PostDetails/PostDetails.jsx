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
    const [vertical, setVertical] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const { post, posts, isLoading } = useSelector((state) => state.postsReducer);

    const toggleView = useCallback(() => setVertical(prev => !prev), []);
    const openPost = useCallback((_id) => navigate(`/posts/${_id}`), [navigate]);
    const handleImageClick = useCallback(() => setIsFullScreen(prev => !prev), []);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(getPost(id)); 
    }, [id, dispatch]);

    useEffect(() => {
        if (post) {
            dispatch(getPostsBySearch({ search: 'none', tags: post?.tags.join(',') }));
        }
    }, [post]);

    if (isLoading) {
        return <CircularProgress className='loader' color='grey' size='4rem' />;
    }

    if (!post) return null;

    const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

    return (
        <div style={{paddingTop:'1.75rem'}}>

            <Button onClick={toggleView} class='verticalbutton'>
                toggle <br /> view
            </Button>

            <div className={`main ${vertical ? 'altview' : ''}`}>
                <div className={`second ${vertical ? 'alt' : ''}`}>
                    <img
                        className={`imag ${isFullScreen ? 'fullscreen' : ''}`}
                        src={post.selectedfile}
                        alt=''
                        onClick={handleImageClick}
                    />
                </div>

                <div className={`first ${vertical ? 'alt' : ''}`}>

                    <Typography variant='h3' style={{fontWeight:'700'}}color="#333">
                        {post.title}
                    </Typography>
                    
                    <Typography gutterBottom variant='h6' color='textSecondary' component='h2'>
                        {post.tags.map((tag) => `#${tag} `)}
                    </Typography>
                    
                    <Typography gutterBottom component='p' className='postmessage' sx={{fontSize:'23px'}} dangerouslySetInnerHTML={{ __html: post.message }} />
                    
                    <Typography variant='h6' color='textSecondary'>
                        Posted by: {post.name}
                    </Typography>
                    
                    <Typography variant='h6' color='textSecondary'>
                        {moment(post.createdAt).fromNow()}
                    </Typography>
                    
                    <CommentsSection post={post} />
                </div>
            </div>

            {recommendedPosts.length ? (
                <div className='sect'>
                    <Typography gutterBottom variant='h5' style={{ color: '#333' }}>
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
                <h3 style={{color:'white'}}>No related posts</h3>
            )}
        </div>
    );
};

export default PostDetails;
