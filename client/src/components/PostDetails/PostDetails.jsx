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
            <div className='loading'>
                <CircularProgress size='7em' style={{ color: 'grey' }} />
            </div>
        );
    }

    return (
        <div className='main' >
            <div className='first'>
                <Typography variant="h3" component="h2">{post.title}</Typography>
                <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
                <hr />
                <Typography gutterBottom variant="body1" component="p" style={{overflow:'hidden',textAlign:'left'}}>{post.message}</Typography>
                <Typography variant="h6">Created by: {post.name}</Typography>
                <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
            </div>
            <div className='second'>
                <img className='imag' src={post.selectedfile} alt='' />
            </div>
        </div>
    );
}

export default PostDetails
