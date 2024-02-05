import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import { likePost, deletePost } from '../../../actions/posts';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import moment from 'moment';
import './post.css';

const Post = ({ post, setCurrentId }) => {

    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'))
    const navigate = useNavigate();
    const [likes, setLikes] = useState(post?.likes)

    const userId = user?.result.googleId || user?.result?._id;
    const hasLikedPost = post.likes.find((like) => like === userId);

    const openPost = () => {
        navigate(`/posts/${post._id}`)
    }

    const handleLike = async () => {
        dispatch(likePost(post._id));

        if (hasLikedPost) {
            setLikes(post.likes.filter((id) => id !== userId));
        } else {
            setLikes([...post.likes, userId]);
        }
    };

    const Likes = () => {
        if (likes.length > 0) {
            return likes.find((like) => like === userId)
                ? (
                    <><ThumbUpAltIcon fontSize="small" /><span style={{ textTransform: 'none' }}>&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}`}</span></>
                ) : (
                    <><ThumbUpAltOutlinedIcon fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
                );
        }
        return <><ThumbUpAltOutlinedIcon fontSize="small" />&nbsp;Like</>;
    };

    return (
        <Card className='card' raised elevation={6} >
            <CardMedia onClick={openPost} className='media' image={post.selectedfile} title={post.title} />
            <div className='overlay'>
                <Typography variant="h6">
                    {post.name}
                </Typography>
                <Typography variant="body">
                    {moment(post.createdAt).fromNow()}
                </Typography>
            </div>
            {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
                <div className='overlay2'>
                    <Tooltip title="Edit" arrow placement='top'>
                        <Button style={{ color: 'white', marginRight: '-25px' }}
                            size="small" onClick={() => setCurrentId(post._id)}>
                            <MoreHorizIcon fontSize='medium' />
                        </Button>
                    </Tooltip>
                </div>
            )}
            <div className="details">
                <Typography variant="body2" color="textSecondary">
                    {post.tags.map((tag) => `#${tag} `)}
                </Typography>
            </div>
            <Typography className='title' variant="h5" gutterBottom>{post.title}
            </Typography>
            <CardContent>
                <Typography color='textSecondary' variant="body2" component="p">
                    {post.message.slice(0, 80)}...
                </Typography>
            </CardContent>
            <CardActions className='cardActions'>
                <Tooltip title="Like" arrow placement='top'>
                    <Button size="small" style={{ color: '#c8102e' }} disabled={!user?.result} onClick={handleLike}>
                        <Likes />
                    </Button>
                </Tooltip>
                {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
                    <Tooltip title="Delete" arrow placement='top'>
                        <Button size="small" style={{ color: 'grey', marginRight: '-15px' }} onClick={() => dispatch(deletePost(post._id))}>
                            <DeleteIcon fontSize='small' style={{ color: 'grey' }} />
                        </Button>
                    </Tooltip>
                )}
            </CardActions>
        </Card>
    )
}

export default Post