import { Typography, TextField, Button, Divider } from '@mui/material';
import { commentPost } from '../../actions/posts';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';

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
                <Typography gutterBottom variant='h6' color='white' style={{ backgroundColor: '#c8102e', paddingLeft: '5px', borderRadius: '5px' }}>Comments</Typography>
                {comments.length && comments?.slice(0).reverse().map((comment, index) => (
                    <Typography key={index} gutterBottom variant='subtitle1'>
                        <strong>{comment.split(': ')[0]} : </strong>
                        {comment.split(':')[1]}
                    </Typography>
                ))}
            </div>
            {user?.result?.name && (
                <div className='write-comment'>
                    <Typography gutterBottom variant='h6' style={{ color: 'grey' }}>
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
                        style={{ marginTop: '10px', color: 'white', backgroundColor: '#c8102e' }}
                        variant='contained'
                        fullWidth
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