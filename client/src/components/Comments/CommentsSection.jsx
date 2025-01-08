import { Typography, TextField, Button } from '@mui/material';
import { commentPost } from '../../actions/posts';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import './comments.css';

const CommentsSection = ({ post, darkmode }) => {

    const [comments, setComments] = useState(post?.comments)
    const [comment, setComment] = useState('');

    const user = JSON.parse(localStorage.getItem('profile'))
    const dispatch = useDispatch();

    const postComment = async () => {
        const finalComment = `${user.result.name}: ${comment}`;
        const newComments = await dispatch(commentPost(finalComment, post._id));    // await is needed here 
        setComments(newComments);
        setComment('');
    }

    return (
        <div className={`commentsOuterContainer ${darkmode ? 'dark' : ''}`}>
            <div className={`commentsInnerContainer ${darkmode ? 'dark' : ''}`}>
                <Typography gutterBottom variant='h6'>Comments</Typography>
                {comments.length ?
                    comments?.slice(0).reverse().map((comment, index) => (

                        <Typography className={`comments-data ${darkmode ? 'dark' : ''}`} key={index} variant='subtitle1'>
                            <strong className={`users-name ${darkmode ? 'dark' : ''}`}>{comment.split(': ')[0]}
                                :
                            </strong> <span className={`comment-data ${darkmode ? 'dark' : ''}`}>{comment.split(':')[1]}</span>
                        </Typography>

                    )) :
                    (
                        <></>
                    )}
            </div>
            {user?.result?.name && (
                <div className={`write-comment ${darkmode ? 'dark' : ''}`}>

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