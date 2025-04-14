import { Card, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { fetchPost, fetchPostsBySearch } from '../../redux/actions/post.actions';
import React, { useEffect, useState, useCallback } from 'react';
import { deletePost } from '../../redux/actions/post.actions';
import { useParams, useNavigate } from 'react-router-dom';
import Comments from '../../components/Comments/Comments';
import { CircularProgress, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../context/themeContext';
import DeleteIcon from '@mui/icons-material/Delete';
import { getProfile } from '../../utils/storage';
import './postdetails.styles.css';
import moment from 'moment';

const PostDetails = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const darkMode = useTheme();
    const profile = getProfile();
    const userId = profile?._id;

    const [isFullScreen, setIsFullScreen] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const { post, posts, isLoading } = useSelector((state) => state.postsReducer);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(fetchPost(id));
    }, [id, dispatch]);

    useEffect(() => {
        if (post) {
            dispatch(fetchPostsBySearch({ search: 'none', tags: post?.tags.join(',') }));
        }
    }, [post, dispatch]);

    const openPost = (_id) => navigate(`/posts/${_id}`);

    const handleImageClick = () => setIsFullScreen((prev) => !prev);

    const toggleDeleteDialog = useCallback(() => {
        setOpenDeleteDialog((prev) => !prev);
    }, []);

    const handleDeletePost = useCallback(() => {
        dispatch(deletePost(id));
        toggleDeleteDialog();
        navigate('/posts');
    }, [dispatch, id, toggleDeleteDialog]);

    const recommendedPosts = posts.filter(({ _id }) => _id !== id);

    if (isLoading) {
        return (
            <CircularProgress className={`loader ${darkMode ? 'dark' : ''}`} size='3rem' />
        )
    }

    if (!post) {
        return (
            <Typography sx={{ margin: '5rem 35%', color: '#666666' }} variant='h4'>
                Post not found!
            </Typography>
        )
    }

    return (
        <div>
            <div className={`main ${darkMode ? 'dark' : ''}`}>
                <ArrowBackOutlinedIcon id='goback' onClick={() => {
                    navigate(-1)
                }} />
                <section className={`second ${isFullScreen ? 'fullscreen' : ''}`}>
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

                    <Typography
                        variant='subtitle1'
                        className={`post-meta ${darkMode ? 'dark' : ''}`}
                    >
                        {post.tags.map((tag) => `#${tag} `)}
                    </Typography>

                    <Typography
                        component='p'
                        className='postmessage'
                        dangerouslySetInnerHTML={{ __html: post.message }}
                    />

                    <Typography
                        variant='h6'
                        className={`post-meta ${darkMode ? 'dark' : ''}`}
                    >
                        Posted by : <strong>{post.name}</strong>
                    </Typography>

                    <Typography
                        variant='h6'
                        className={`post-meta ${darkMode ? 'dark' : ''}`}
                    >
                        <div className='dateAndDelete'>
                            <span>
                                {moment(post.createdAt).fromNow()}
                            </span>
                            <span>
                                {userId === post?.creator && (
                                    <Tooltip title="Delete" arrow placement="top">
                                        <Button
                                            size="small"
                                            onClick={toggleDeleteDialog}
                                        >
                                            <DeleteIcon
                                                color="error"
                                                fontSize="small"
                                                titleAccess=""
                                            />
                                        </Button>
                                    </Tooltip>
                                )}
                            </span>
                        </div>
                    </Typography>

                    <Comments post={post} />
                </section>
            </div>

            {userId === post?.creator && (
                <Dialog
                    open={openDeleteDialog}
                    onClose={toggleDeleteDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Are you sure you want to delete this post?"}
                    </DialogTitle>

                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={toggleDeleteDialog} variant="contained">
                            Cancel
                        </Button>
                        <Button onClick={handleDeletePost} variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {recommendedPosts.length ? (
                <div className={`sect ${darkMode ? 'dark' : ''}`}>
                    <Typography gutterBottom variant='h5'>
                        You might also like
                    </Typography>

                    <Divider />

                    <div className={`recommended-posts ${darkMode ? 'dark' : ''}`}>
                        {recommendedPosts.map(({ title, likes, selectedfile, _id }) => (
                            <Card
                                raised
                                className={`recommended-post ${darkMode ? 'dark' : ''}`}
                                onClick={() => openPost(_id)} key={_id}
                            >
                                <Typography gutterBottom variant='h6'>{title}</Typography>

                                <img
                                    src={selectedfile}
                                    className='recimg'
                                    alt='alt.img'
                                    onClick={() => openPost(_id)}
                                />

                                <Typography gutterBottom variant='subtitle1'>
                                    {likes.length} likes
                                </Typography>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <Typography variant='h5' className='endmessage' gutterBottom align='center'>
                    No related posts!
                </Typography>
            )}
        </div>
    );
};

export default PostDetails;
