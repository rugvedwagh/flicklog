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
import defimg from '../../assets/defimg.jpg';
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
                <Typography variant="subtitle1" fontWeight="600">
                    {post.name}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {moment(post.createdAt).fromNow()}
                </Typography>
            </div>

            <section onClick={openPost} className="content-section">
                <Typography
                    className={`title ${darkMode ? 'dark' : ''}`}
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        lineHeight: 1.3,
                    }}
                >
                    {post.title.slice(0, 25)}
                </Typography>

                <div className="tags-container">
                    {post.tags?.map((tag) => (
                        <Typography
                            key={tag}
                            variant="caption"
                            className={`tag ${darkMode ? 'dark' : ''}`}
                        >
                            #{tag}
                        </Typography>
                    ))}
                </div>

                <div className="msg">
                    <Typography
                        variant="body2"
                        component="p"
                        className={`msg-text ${darkMode ? 'dark' : ''}`}
                        sx={{
                            lineHeight: 1.5,
                            letterSpacing: 0.2,
                            padding: '0 1rem'  // Added consistent padding
                        }}
                        dangerouslySetInnerHTML={{ __html: post.message.slice(0, 135) + ' ...' }}
                    />
                </div>
            </section>

            <CardActions className="cardActions" sx={{ padding: '0.5rem 1rem !important' }}>
                {/* Left-aligned buttons */}
                <div style={{ display: 'flex', flexGrow: 1 }}>
                    <Tooltip title="Like" arrow placement="top">
                        <Button size="small" onClick={handleLike} sx={{ minWidth: 0 }}>
                            <Likes
                                likes={likes}
                                id={userId}
                                darkMode={darkMode}
                            />
                        </Button>
                    </Tooltip>

                    <Tooltip title="Comments" arrow placement="top">
                        <Button size="small" sx={{ minWidth: 0 }}>
                            <div className="comment-wrapper" onClick={openPost}>
                                <CommentOutlinedIcon className={`comment-button ${darkMode ? 'dark' : ''}`} fontSize="small" />
                                <span className={`comment-count ${darkMode ? 'dark' : ''}`}>
                                    &nbsp;{post?.comments?.length}
                                </span>
                            </div>
                        </Button>
                    </Tooltip>

                    {userId && (
                        <Tooltip title={isbookmarked ? "Remove bookmark" : "Add bookmark"} arrow placement="top">
                            <Button size="small" onClick={handleBookmarkToggle} sx={{ minWidth: 0 }}>
                                {isbookmarked ? (
                                    <BookmarkIcon className={`bookmark-button ${darkMode ? 'dark' : ''}`} fontSize="small" />
                                ) : (
                                    <BookmarkBorderOutlinedIcon className={`bookmark-button ${darkMode ? 'dark' : ''}`} fontSize="small" />
                                )}
                            </Button>
                        </Tooltip>
                    )}
                </div>

                {/* Right-aligned edit button */}
                {userId === post?.creator && (
                    <Tooltip title="Edit" arrow placement="top">
                        <Button
                            size="small"
                            onClick={() => { setCurrentId(post._id); setformopen(true) }}
                            sx={{ minWidth: 0, marginLeft: 'auto' }}
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