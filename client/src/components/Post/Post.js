import { Card, CardActions, CardMedia, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from '@mui/material';
import { likePost, deletePost } from '../../actions/posts';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import comment from '../../assets/comment.svg'
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import Likes from '../Likes/Likes'
import moment from 'moment';
import defimg from '../../assets/defimg.jpg'
import './post.css';

const Post = ({ post, setCurrentId }) => {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const navigate = useNavigate();
    const [likes, setLikes] = useState(post?.likes);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const userId = user?.result.googleId || user?.result?._id;
    const hasLikedPost = post.likes.find((like) => like === userId);

    const openPost = () => {
        navigate(`/posts/${post._id}`);
    };

    const toggleDeleteDialog = () => setOpenDeleteDialog((prev) => !prev);

    const handleDeletePost = () => {
        dispatch(deletePost(post._id));
        toggleDeleteDialog();
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
        <Card className='card' raised elevation={6} >
            <CardMedia
                onClick={openPost}
                className="media"
                image={post.selectedfile || defimg}
                title={post.title || "Default Title"}
            />
            <div className='overlay'>
                <Typography variant="h6">
                    {post.name}
                </Typography>
                <Typography variant="body">
                    {moment(post.createdAt).fromNow()}
                </Typography>
            </div>
            {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
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
            <Typography variant="body2" color="textSecondary" style={{ padding: '5px 16px 0px 16px' }}>
                {post.tags.map((tag) => `#${tag} `)}
            </Typography>
            <Typography className='title' variant="h5" gutterBottom>
                {post.title.slice(0, 43)}
            </Typography>
            <div className='msg'>
                <Typography color='textSecondary' variant="body2" component="p" dangerouslySetInnerHTML={{ __html: post.message.slice(0, 85) + ' ...' }} />
            </div>
            <CardActions className='cardActions'>
                <Tooltip title="Like" arrow placement="top">                            
                    <Button
                        size="small"
                        style={{ color: 'black' }}
                        disabled={!user?.result}
                        onClick={handleLike}
                    >
                        <Likes likes={likes} id={userId} />
                    </Button>
                </Tooltip>

                <Tooltip title="Comments" arrow placement="top">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={comment} style={{ height: '23px' }} alt="comment icon" />
                        <span style={{ fontSize: '15px', color: 'black' }}>
                            &nbsp;{post?.comments?.length}
                        </span>
                    </div>
                </Tooltip>

                {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
                    <Tooltip title="Delete" arrow placement="top">
                        <Button
                            size="small"
                            style={{ color: 'grey', marginRight: '-15px' }}
                            onClick={toggleDeleteDialog}
                        >
                            <DeleteIcon fontSize="small" titleAccess="" />
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

        </Card >
    );
};

export default Post;
