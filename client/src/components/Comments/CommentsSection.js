import { Typography, TextField, Button } from '@mui/material';
import { addComment } from '../../actions/post.actions';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import './commentsection.styles.css';

const CommentsSection = ({ post, darkMode }) => {

    const dispatch = useDispatch();
    const profile = JSON.parse(localStorage.getItem('profile'))

    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(post?.comments)

    const postComment = async () => {
        const finalComment = `${profile?.user.name}: ${comment}`;
        const newComments = await dispatch(addComment(finalComment, post._id));    // await is needed here 
        setComments(newComments);
        setComment('');
    }

    return (
        <div className={`commentsOuterContainer ${darkMode ? 'dark' : ''}`}>
            <div className={`commentsInnerContainer ${darkMode ? 'dark' : ''}`}>
                <Typography gutterBottom variant='h6'>Comments</Typography>
                {comments.length ?
                    comments?.slice(0).reverse().map((comment, index) => (

                        <Typography className={`comments-data ${darkMode ? 'dark' : ''}`} key={index} variant='subtitle1'>
                            <strong className={`users-name ${darkMode ? 'dark' : ''}`}>{comment.split(': ')[0]}
                                :
                            </strong> <span className={`comment-data ${darkMode ? 'dark' : ''}`}>{comment.split(':')[1]}</span>
                        </Typography>

                    )) :
                    (
                        <></>
                    )}
            </div>
            {profile?.user?.name && (
                <div className={`write-comment ${darkMode ? 'dark' : ''}`}>

                    <Typography gutterBottom variant='h6'>
                        Write a Comment
                    </Typography>

                    <TextField
                        fullWidth
                        rows={3}
                        variant='outlined'
                        label='Comment...'
                        multiline
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <Button
                        style={{ marginTop: '10px' }}
                        variant='contained'
                        fullWidth
                        disabled={!comment.trim()}
                        onClick={postComment}
                    >
                        Comment
                    </Button>
                </div>
            )}
        </div>
    )
}

export default CommentsSection