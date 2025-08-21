import { Card, CardActions, CardMedia, Button, Typography, Tooltip } from '@mui/material';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, bookmarkPost } from '../../redux/actions/post.actions';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { fetchUserProfile } from '../../utils/storage';
import { useForm } from '../../context/formContext';
import { useDebounce } from '../../utils/debounce';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import defimg from '../../assets/defimg.jpg';
import parse from 'html-react-parser';
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
        setIsBookmarked(bookmarks?.includes(post._id));
    }, [clientData, post._id, bookmarks]);

    const openPost = () => {
        navigate(`/posts/${post._id}/${post.slug}`);
    };

    const handleBookmarkToggle = () => {
        debouncedDispatchBookmark(post._id);
        setIsBookmarked(!isbookmarked);
    };

    const debouncedDispatchBookmark = useDebounce((postId) => {
        dispatch(bookmarkPost(postId, userId));
    }, 1500);

    const debouncedDispatchLike = useDebounce((postId) => {
        dispatch(likePost(postId));
    }, 1500);

    const handleLike = () => {
        if (!userId) return;

        if (hasLikedPost) {
            setLikes((prev) => prev.filter((id) => id !== userId));
        } else {
            setLikes((prev) => [...prev, userId]);
        }

        debouncedDispatchLike(post._id);
    };

    return (
        <Card className={`card ${darkMode ? 'dark' : ''}`} raised elevation={0}>
            <div className="card-header">
                <CardMedia
                    onClick={openPost}
                    className="media"
                    image={post.selectedfile || defimg}
                    title={post.title || "Default Title"}
                />

                <div className="overlay">
                    <div className="overlay-content">
                        <Typography variant="subtitle2" fontWeight="600" className="author-name">
                            {post.name}
                        </Typography>
                        <Typography variant="caption" className="post-time">
                            {moment(post.createdAt).fromNow()}
                        </Typography>
                    </div>
                </div>
            </div>

            <div className="card-content">
                <section onClick={openPost} className="content-section">
                    <Typography
                        className={`title ${darkMode ? 'dark' : ''}`}
                        variant="h6"
                    >
                        {post.title}
                    </Typography>

                    {post.tags?.length > 0 && (
                        <div className="tags-container">
                            {post.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className={`tag ${darkMode ? 'dark' : ''}`}
                                >
                                    #{tag}
                                </span>
                            ))}
                            {post.tags.length > 3 && (
                                <span className={`tag more-tag ${darkMode ? 'dark' : ''}`}>
                                    +{post.tags.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    <div className="msg">
                        <Typography
                            variant="body2"
                            component="p"
                            className={`msg-text ${darkMode ? 'dark' : ''}`}
                            sx={{ margin: '0' }}
                        >
                            {parse(
                                post.message
                                    ? post.message.slice(0, 150) + (post.message.length > 150 ? '...' : '')
                                    : ""
                            )}
                        </Typography>
                    </div>

                </section>

                <CardActions className="cardActions">
                    <div className="actions-left">
                        <Tooltip title="Like" arrow placement="top">
                            <Button size="small" onClick={handleLike} className="action-btn">
                                <Likes
                                    likes={likes}
                                    id={userId}
                                    darkMode={darkMode}
                                />
                            </Button>
                        </Tooltip>

                        <Tooltip title="Comments" arrow placement="top">
                            <Button size="small" className="action-btn">
                                <div className="comment-wrapper" onClick={openPost}>
                                    <CommentOutlinedIcon className={`comment-button ${darkMode ? 'dark' : ''}`} fontSize="small" />
                                    <span className={`comment-count ${darkMode ? 'dark' : ''}`}>
                                        {post?.comments?.length}
                                    </span>
                                </div>
                            </Button>
                        </Tooltip>

                        {userId && (
                            <Tooltip title={isbookmarked ? "Remove bookmark" : "Add bookmark"} arrow placement="top">
                                <Button size="small" onClick={handleBookmarkToggle} className="action-btn">
                                    {isbookmarked ? (
                                        <BookmarkIcon className={`bookmark-button ${darkMode ? 'dark' : ''}`} fontSize="small" />
                                    ) : (
                                        <BookmarkBorderOutlinedIcon className={`bookmark-button ${darkMode ? 'dark' : ''}`} fontSize="small" />
                                    )}
                                </Button>
                            </Tooltip>
                        )}
                    </div>

                    {userId === post?.creator && (
                        <Tooltip title="Edit" arrow placement="top">
                            <Button
                                size="small"
                                onClick={() => { setCurrentId(post._id); setformopen(true) }}
                                className="action-btn edit-btn"
                            >
                                <EditIcon className={`bookmark-button ${darkMode ? 'dark' : ''}`} fontSize='small' />
                            </Button>
                        </Tooltip>
                    )}
                </CardActions>
            </div>
        </Card>
    );
};

export default PostCard;
