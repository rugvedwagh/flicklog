import { Card, CardActions, CardMedia, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from '@mui/material';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import { likePost, deletePost } from '../../../actions/post.action';
import { useDispatch, useSelector } from 'react-redux';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { bookmarkPost } from '../../../actions/auth.action';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import defimg from '../../../assets/defimg.jpg';
import Likes from './Likes/Likes';
import moment from 'moment';
import './post.styles.css';

const Post = ({ post, setCurrentId, darkMode }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('profile'));
    const userId = user?.result?._id;
    const { clientData } = useSelector((state) => state.authReducer);

    const [likes, setLikes] = useState(post?.likes);
    const [isbookmarked, setIsBookmarked] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);


    const hasLikedPost = useMemo(() => post.likes.includes(userId), [post.likes, userId]);

    useEffect(() => {
        if (clientData?.bookmarks?.includes(post._id)) {
            setIsBookmarked(true);
        } else {
            setIsBookmarked(false);
        }
    }, [clientData, post._id]);

    const openPost = () => {
        navigate(`/posts/${post._id}`);
    };

    const toggleDeleteDialog = useCallback(() => {
        setOpenDeleteDialog((prev) => !prev);
    }, []);

    const handleDeletePost = useCallback(() => {
        dispatch(deletePost(post._id));
        toggleDeleteDialog();
    }, [dispatch, post._id, toggleDeleteDialog]);

    const handleBookmarkToggle = () => {
        dispatch(bookmarkPost(post._id, clientData?._id));
        setIsBookmarked((prev) => !prev);
    };

    const handleLike = async () => {
        dispatch(likePost(post._id));

        if (hasLikedPost) {
            setLikes(post.likes.filter((id) => id !== userId));
        } else {
            setLikes([...post.likes, userId]);
        }
    };

    return (
        <Card className={`card ${darkMode ? 'dark' : ''}`} raised elevation={6}>
            <CardMedia
                onClick={openPost}
                className="media"
                image={post.selectedfile || defimg}
                title={post.title || "Default Title"}
            />

            <div className="overlay">
                <Typography variant="h6">{post.name}</Typography>
                <Typography variant="body">{moment(post.createdAt).fromNow()}</Typography>
            </div>

            {userId === post?.creator && (
                <div className="overlay2">
                    <Tooltip title="Edit" arrow placement="top">
                        <Button
                            style={{ color: 'white', marginRight: '-25px' }}
                            size="small"
                            onClick={() => setCurrentId(post._id)}
                        >
                            <MoreHorizIcon fontSize="medium" />
                        </Button>
                    </Tooltip>
                </div>
            )}

            <Typography color="textSecondary" variant="body2" className={`tags ${darkMode ? 'dark' : ''}`}>
                {post.tags.map((tag) => `#${tag} `)}
            </Typography>

            <Typography className={`title ${darkMode ? 'dark' : ''}`} variant="h5" gutterBottom>
                {post.title.slice(0, 43)}
            </Typography>

            <div className="msg">
                <Typography color="textSecondary" variant="body2" component="p" className={`msg-text ${darkMode ? 'dark' : ''}`} dangerouslySetInnerHTML={{ __html: post.message.slice(0, 85) + ' ...' }} />
            </div>

            <CardActions className="cardActions">
                <Tooltip title="Like" arrow placement="top">
                    <Button
                        size="small"
                        style={{ color: 'black' }}
                        onClick={handleLike}
                    >
                        <Likes className={`interaction-buttons ${darkMode ? 'dark' : ''}`} likes={likes} id={userId} darkMode={darkMode} disabled/>
                    </Button>
                </Tooltip>

                <Tooltip title="Comments" arrow placement="top">
                    <Button style={{ color: 'black' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }} onClick={openPost}>
                            <CommentOutlinedIcon className={`interaction-buttons ${darkMode ? 'dark' : ''}`} fontSize="small" />
                            <span style={{ fontSize: '15px', opacity: '0.8' }} className={`interaction-buttons ${darkMode ? 'dark' : ''}`}>
                                &nbsp;{post?.comments?.length}
                            </span>
                        </div>
                    </Button>
                </Tooltip>

                {userId && (
                    <Tooltip title="Bookmark" arrow placement="top">
                        <Button style={{ color: 'black' }}>
                            {isbookmarked ? (
                                <BookmarkIcon className={`interaction-buttons ${darkMode ? 'dark' : ''}`} onClick={handleBookmarkToggle} fontSize="small" />
                            ) : (
                                <BookmarkBorderOutlinedIcon className={`interaction-buttons ${darkMode ? 'dark' : ''}`} onClick={handleBookmarkToggle} fontSize="small" />
                            )}
                        </Button>
                    </Tooltip>
                )}

                {userId === post?.creator && (
                    <Tooltip title="Delete" arrow placement="top">
                        <Button
                            size="small"
                            onClick={toggleDeleteDialog}
                        >
                            <DeleteIcon className={`interaction-buttons ${darkMode ? 'dark' : ''}`} fontSize="small" titleAccess="" />
                        </Button>
                    </Tooltip>
                )}
            </CardActions>

            <Dialog
                open={openDeleteDialog}
                onClose={toggleDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this post?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleDeleteDialog} variant="contained" style={{ color: 'white', backgroundColor: 'black' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeletePost} variant="contained" style={{ color: 'white', backgroundColor: 'black' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default Post;
