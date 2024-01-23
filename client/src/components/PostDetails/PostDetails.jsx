import { Typography, CircularProgress } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getPost } from '../../actions/posts'
import React, { useEffect } from 'react'
import moment from 'moment'
import './postdetail.css'
import CommentsSection from './CommentsSection'

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
            <CircularProgress className='loader' color='grey' size='4rem'/>
        );
    }

    return (
        <div className='main' >
            <div className='first'>
                <Typography variant="h3" component="h2">{post.title}</Typography>
                <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
                <hr />
                <Typography gutterBottom variant="body1" component="p" style={{ overflow: 'hidden', textAlign: 'left' }}>{post.message}</Typography>
                <hr />
                <Typography variant="h6"><span style={{color:'grey'}}>Posted by</span>: {post.name}</Typography>
                <Typography variant="body1" style={{ color: 'grey' }}>{moment(post.createdAt).fromNow()}</Typography>
                <hr />
                <CommentsSection post={post}/>
            </div>
            <div className='second'>
                <img className='imag' src={post.selectedfile} alt='' />
            </div>
        </div>
    );
}

export default PostDetails
