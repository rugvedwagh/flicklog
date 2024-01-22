import React, { useState, useRef } from 'react'
import { Typography, TextField, Button } from '@mui/material'
import { useDispatch } from 'react-redux'
import { commentPost } from '../../actions/posts'

const CommentsSection = ({ post }) => {
    const [comments, setComments] = useState(post?.comments)
    const [comment, setComment] = useState('');
    const user = JSON.parse(localStorage.getItem('profile'))
    const dispatch = useDispatch();

    const handleClick = async () => {
        const finalComment = `${user.result.name}: ${comment}`

        const newComments = await dispatch(commentPost(finalComment, post._id));

        setComments(newComments);
        setComment('');
    }

    return (
        <div className="commentsOuterContainer">
            <div className="commentsInnerContainer">
                <Typography gutterBottom variant='h6'>Comments</Typography>
                {/* {comments.map((comment, i) => (
                    <Typography key={i} gutterBottom variant='subtitle1'>
                        {comment}
                    </Typography>
                ))} */}
                {comments.map((comment, i) => {
                    // Split the comment into user's name and comment text
                    const [name, text] = comment.split(': ');

                    return (
                        <Typography key={i} gutterBottom variant='subtitle1'>
                            <span style={{ color: 'grey' }}>{name}:</span> <span>{text}</span>
                        </Typography>
                    );
                })}
            </div>
            {user?.result?.name && (
                <div style={{ width: '50%' }}>
                    <Typography gutterBottom variant='h6' style={{ color: 'grey' }}>Write a Comment</Typography>
                    <TextField
                        fullWidth
                        rows={3}
                        variant='outlined'
                        label='Comment...'
                        multiline
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button style={{ marginTop: '10px', border: '1px solid grey', color: 'black' }} fullWidth
                        disabled={!comment}
                        onClick={handleClick}
                    >
                        Comment
                    </Button>
                </div>
            )}
        </div>
    )
}

export default CommentsSection