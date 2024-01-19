import { Paper, Typography, CircularProgress } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getPost } from '../../actions/posts'
import React, { useEffect } from 'react'
import moment from 'moment'
import './postdetail.css'

const PostDetails = () => {
    const { post, isLoading } = useSelector((state) => state.posts)
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        dispatch(getPost(id));
    }, [id, dispatch])

    if (!post) return null;

    if (isLoading) {
        return (
            <Paper elevation={6} className='loadingPaper'>
                <CircularProgress size='7em' style={{ margin: '100px 45%', color: 'grey' }} />
            </Paper>
        );
    }

    return (
        <Paper style={{ borderRadius: '15px', padding: '10px' }} elevation={6}>
            <div className='card'>
                <div className='section'>
                    <Typography variant="h3" component="h2">{post.title}</Typography>
                    <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
                    <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
                    <Typography variant="h6">Created by: {post.name}</Typography>
                    <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
                </div>
                <div className='imageSection'>
                    <img className='imag' src={post.selectedfile} alt='' />
                </div>
            </div>
        </Paper>
    );
}

export default PostDetails
