import { Typography, CircularProgress, Divider, Card } from '@mui/material';
import CommentsSection from '../../components/Comments/CommentsSection';
import { fetchPost, fetchPostsBySearch} from '../../redux/actions/post.actions'
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import './postdetails.styles.css';
import moment from 'moment';

const PostDetails = ({ darkMode }) => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isFullScreen, setIsFullScreen] = useState(false);

    const { post, posts, isLoading } = useSelector((state) => state.postsReducer);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(fetchPost(id));
    }, [id, dispatch]);

    useEffect(() => {
        if (post) {
            dispatch(fetchPostsBySearch({ search: 'none', tags: post?.tags.join(',') }));
        }
    }, [post, dispatch]);       // Might remove this later!! Just seeing how this affects the page

    const openPost = (_id) => navigate(`/posts/${_id}`)
    const handleImageClick = () => setIsFullScreen(prev => !prev);

    if (isLoading) {
        return <CircularProgress className={`loader ${darkMode ? 'dark' : ''}`} size='3rem' />;
    }

    if (!post) return null;

    const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

    return (
        <div sx={{ paddingTop: '1.25rem' }}>

            <div className={`main ${darkMode ? 'dark' : ''}`}>
                <section className='second'>
                    <img
                        className={`imag ${isFullScreen ? 'fullscreen' : ''}`}
                        src={post.selectedfile}
                        alt=''
                        onClick={handleImageClick}
                    />
                </section>

                <section className='first'>
                    <Typography className={`posttitle ${darkMode ? 'dark' : ''}`} >
                        {post.title}
                    </Typography>

                    <Typography variant='subtitle1' className={`post-meta ${darkMode ? 'dark' : ''}`}>
                        {post.tags.map((tag) => `#${tag} `)}
                    </Typography>

                    <Typography component='p' className='postmessage' dangerouslySetInnerHTML={{ __html: post.message }} />

                    <Typography variant='h6' className={`post-meta ${darkMode ? 'dark' : ''}`}>
                        Posted by: <strong>{post.name}</strong>
                    </Typography>

                    <Typography variant='h6' className={`post-meta ${darkMode ? 'dark' : ''}`}>
                        {moment(post.createdAt).fromNow()}
                    </Typography>

                    <CommentsSection darkMode={darkMode} post={post} />
                </section>
            </div>

            {recommendedPosts.length ? (
                <div className={`sect ${darkMode ? 'dark' : ''}`}>
                    <Typography gutterBottom variant='h5' sx={{ color: '#1a1a1a', userSelect: 'none' }}>
                        You might also like
                    </Typography>

                    <Divider />

                    <div className={`recommended-posts ${darkMode ? 'dark' : ''}`}>
                        {recommendedPosts.map(({ title, likes, selectedfile, _id }) => (

                            <Card raised className={`recommended-post ${darkMode ? 'dark' : ''}`} onClick={() => openPost(_id)} key={_id}>
                                <Typography gutterBottom variant='h6'>{title}</Typography>

                                <img
                                    src={selectedfile}
                                    className='recimg'
                                    alt='alt.img'
                                    onClick={() => openPost(_id)}
                                />

                                <Typography gutterBottom variant='subtitle1'>{likes.length} likes</Typography>
                            </Card>

                        ))}
                    </div>
                </div>
            ) : (
                <Typography variant='h5' className='endmessage' gutterBottom align='center'  > No related posts!</Typography>
            )}
        </div>
    );
};

export default PostDetails;