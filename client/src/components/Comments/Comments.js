import { Typography, TextField, Button } from '@mui/material';
import { addComment } from '../../redux/actions/post.actions';
import { getRefreshToken } from '../../utils/getTokens';
import { useTheme } from '../../context/themeContext';
import { getProfile } from '../../utils/storage';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import './comments.styles.css';

const CommentsSection = ({ post }) => {
    
    const dispatch = useDispatch();
    const darkMode = useTheme();

    const profile = getProfile();
    const UserIsAuthenticated = getRefreshToken();

    const [comment, setComment] = useState('');
    const [isFocused, setIsFocused] = useState(false); 
    const [comments, setComments] = useState(post?.comments);

    const postComment = async () => {
        const finalComment = `${profile?.name}: ${comment}`;
        const newComments = await dispatch(addComment(finalComment, post._id));
        setComments(newComments);
        setComment('');
        setIsFocused(false);
    };

    return (
        <div className={`commentsOuterContainer ${darkMode ? 'dark' : ''}`}>
            <div className={`commentsInnerContainer ${darkMode ? 'dark' : ''}`}>
                <Typography gutterBottom variant="h6">Comments</Typography>
                {comments.length > 0 &&
                    comments.slice(0).reverse().map((comment, index) => (
                        <Typography
                            className={`comments-data ${darkMode ? 'dark' : ''}`}
                            key={index}
                            variant="subtitle1"
                        >
                            <strong className={`users-name ${darkMode ? 'dark' : ''}`}>
                                {comment?.split(': ')[0]}:
                            </strong>
                            <span className={`comment-data ${darkMode ? 'dark' : ''}`}>
                                {comment?.split(':')[1]}
                            </span>
                        </Typography>
                    ))
                }
            </div>

            {UserIsAuthenticated && (
                <div className={`write-comment ${darkMode ? 'dark' : ''}`}>
                    <TextField
                        fullWidth
                        rows={1}
                        variant="outlined"
                        label="Add a comment..."
                        multiline
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => !comment.trim() && setIsFocused(false)} 
                    />

                    {isFocused &&
                        (
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={postComment}
                            >
                                Comment
                            </Button>
                        )}
                </div>
            )}
        </div>
    );
};

export default CommentsSection;
