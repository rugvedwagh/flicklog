import { Typography, CircularProgress, Divider, Card, CardMedia } from '@mui/material'
import { getPost, getPostsBySearch } from '../../actions/posts'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import CommentsSection from './CommentsSection'
import React, { useEffect } from 'react'
import moment from 'moment'
import './postdetail.css'

const PostDetails = () => {

    const { post, posts, isLoading } = useSelector((state) => state.posts)
    const dispatch = useDispatch();
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getPost(id));
    }, [id, dispatch])

    useEffect(() => {
        if (post) {
            dispatch(getPostsBySearch({ search: 'none', tags: post?.tags.join(',') }));
        }
    }, [post]);

    if (!post) return null;

    const openPost = (_id) => navigate(`/posts/${_id}`);

    if (isLoading) {
        return (
            <CircularProgress className='loader' color='grey' size='4rem' />
        );
    }

    const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

    return (
        <div className="cont">
            <div className='main' >
                <div className='first'>
                    <h2 className='posttitle'>{post.title}</h2>
                    <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
                    <Typography gutterBottom variant="body1" component="p" style={{ overflow: 'hidden' }}>{post.message}</Typography>
                    <Typography variant="h6"><span style={{ color: 'grey' }}>Posted by</span>: {post.name}</Typography>
                    <Typography variant="body1" style={{ color: 'grey' }}>{moment(post.createdAt).fromNow()}</Typography>
                    <Divider />
                    <CommentsSection post={post} />
                </div>
                <div className='second'>
                    <img className='imag' src={post.selectedfile} alt='' />
                </div>
            </div>
            {!!recommendedPosts.length && (
    <div className='sect'>
        <Typography gutterBottom variant="h5">You might also like:</Typography>
        <Divider />
        <div className='recommendedPosts'>
            {recommendedPosts.map(({ title, likes, selectedfile, _id }) => (
                <Card class='recpost' onClick={() => openPost(_id)} key={_id}>
                    <Typography gutterBottom variant="h6">{title}</Typography>
                    <Divider />
                    <img src={selectedfile} class='recimg' width="200px" style={{ borderRadius: '5px' }} />
                    <Typography gutterBottom variant="subtitle1">{likes.length} likes</Typography>
                </Card>
            ))}
        </div>
    </div>
)}

        </div>
    );
}

export default PostDetails
