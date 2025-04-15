import { Card, CardActions, CardMedia, Button, Typography, Tooltip } from '@mui/material';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likePost } from '../../redux/actions/post.actions';
import { bookmarkPost } from '../../redux/actions/post.actions';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { fetchUserProfile } from '../../utils/storage';
import { useForm } from '../../context/formContext';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import defimg from '../../assets/defimg.jpg'
import Likes from './Likes/Likes';
import './postcard.styles.css';
import moment from 'moment';


const PostCard = ({ post, setCurrentId, darkMode, bookmarks }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    let profile = fetchUserProfile();
    const userId = profile?._id;

    const clientData = useSelector((state) => state.authReducer.clientData);

    const [likes, setLikes] = useState(post?.likes);
    const [isbookmarked, setIsBookmarked] = useState(false);

    const { setformopen } = useForm();

    const hasLikedPost = useMemo(() => post.likes.includes(userId), [post.likes, userId]);

    useEffect(() => {
        setIsBookmarked(bookmarks?.includes(post._id))
    }, [clientData, post._id]);

    const openPost = () => {
        navigate(`/posts/${post._id}`);
    };

    const handleBookmarkToggle = () => {
        dispatch(bookmarkPost(post._id, userId));
        setIsBookmarked(!isbookmarked);
    };

    const handleLike = async () => {
        if (userId) {
            dispatch(likePost(post._id));
        }
        hasLikedPost ? setLikes(post.likes.filter((id) => id !== userId)) : setLikes([...post.likes, userId]);
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
                <Typography variant="h6">
                    {post.name}
                </Typography>

                <Typography sx={{ fontSize: '14px' }}>
                    {moment(post.createdAt).fromNow()}
                </Typography>
            </div>

            <section onClick={openPost}>
                <Typography
                    className={`title ${darkMode ? 'dark' : ''}`}
                    variant="h5"
                    gutterBottom
                >
                    {post.title.slice(0, 25)}
                </Typography>

                <div className="msg">
                    <Typography
                        color="textSecondary"
                        variant="body2"
                        component="p"
                        className={`msg-text ${darkMode ? 'dark' : ''}`}
                        dangerouslySetInnerHTML={{ __html: post.message.slice(0, 115) + ' ...' }}
                    />
                </div>
            </section>

            <CardActions className="cardActions">
                <Tooltip title="Like" arrow placement="top">
                    <Button size="small" onClick={handleLike}>
                        <Likes
                            likes={likes}
                            id={userId}
                            darkMode={darkMode}
                        />
                    </Button>
                </Tooltip>

                <Tooltip title="Comments" arrow placement="top">
                    <Button>
                        <div style={{ display: 'flex', alignItems: 'center' }} onClick={openPost}>
                            <CommentOutlinedIcon className={`comment-button ${darkMode ? 'dark' : ''}`} fontSize="small" />
                            <span style={{ fontSize: '15px', opacity: '0.8' }} className={`comment-button ${darkMode ? 'dark' : ''}`}>
                                &nbsp;{post?.comments?.length}
                            </span>
                        </div>
                    </Button>
                </Tooltip>

                {userId && (
                    <Tooltip title="Bookmark" arrow placement="top">
                        <Button onClick={handleBookmarkToggle}>
                            {isbookmarked ? (
                                <BookmarkIcon className={`bookmark-button ${darkMode ? 'dark' : ''}`} fontSize="small" />
                            ) : (
                                <BookmarkBorderOutlinedIcon className={`bookmark-button ${darkMode ? 'dark' : ''}`} fontSize="small" />
                            )}
                        </Button>
                    </Tooltip>
                )}

                {userId === post?.creator && (
                    <Tooltip title="Edit" arrow placement="top">
                        <Button
                            size="small"
                            onClick={() => { setCurrentId(post._id); setformopen(true) }}
                        >
                            <EditIcon className={`bookmark-button ${darkMode ? 'dark' : ''}`} fontSize='small' />
                        </Button>
                    </Tooltip>
                )}
            </CardActions>
        </Card>
    );
};

export default PostCard;