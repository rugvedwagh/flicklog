import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';
import { likePost, deletePost } from '../../../actions/posts';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import React from 'react';
import './styles.css';

const Post = ({ post, setCurrentId }) => {

    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'))

    return (
        <Card className='card'>
            <CardMedia className='media' image={post.selectedfile || 'https://imgs.search.brave.com/TwuJTc6t6dT3607OMKu4PEleIdW4ZjtDpfQtr2apXnQ/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9odG1s/Y29sb3Jjb2Rlcy5j/b20vYXNzZXRzL2lt/YWdlcy9jb2xvcnMv/Z3JheS1jb2xvci1z/b2xpZC1iYWNrZ3Jv/dW5kLTE5MjB4MTA4/MC5wbmc'} title={post.title} />
            <div className='overlay'>
                <Typography variant="h6">
                    {post.name}
                </Typography>
                <Typography variant="body">
                    {moment(post.createdAt).fromNow()}
                </Typography>
            </div>
            {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
                <div className='overlay2'>
                    <Button style={{ color: 'white' }}
                        size="small" onClick={() => setCurrentId(post._id)}>
                        <MoreHorizIcon fontSize='default' />
                    </Button>
                </div>
            )
            }
            <div className="details">
                <Typography variant="body2" color="textSecondary">
                    {post.tags.map((tag) => `#${tag} `)}
                </Typography>
            </div>
            <Typography className='title' variant="h5" gutterBottom>{post.title}
            </Typography>
            <CardContent>
                <Typography color='textSecondary' variant="body2" component="p">{post.message}
                </Typography>
            </CardContent>
            <CardActions className='cardActions'>
                <Button size="small" color="primary" onClick={() => dispatch(likePost(post._id))}>
                    <ThumbUpAltIcon fontSize='small' />
                    &nbsp; Like &nbsp;
                    {/* // For leaving space after and before the like */}
                    {post?.likes.length}
                </Button>
                {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (

                    <Button size="small" color="primary" onClick={() => dispatch(deletePost(post._id))}>
                        <DeleteIcon fontSize='small' />
                        Delete
                    </Button>
                )}
            </CardActions>
        </Card>
    )
}

export default Post