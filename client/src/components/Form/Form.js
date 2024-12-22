import { TextField, Button, Typography, Paper } from '@mui/material';
import { createPost, updatePost } from '../../actions/posts';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import FileBase from 'react-file-base64';
import ReactQuill from 'react-quill';
import './styles.css';


const Form = ({ currentId, setCurrentId, setformOpen }) => {

    const [postData, setPostData] = useState({
        title: '',
        message: '',
        tags: '',
        selectedfile: '',
    });

    const dispatch = useDispatch();
    const post = useSelector((state) => (currentId ? state.posts.posts.find((message) => message._id === currentId) : null));
    const user = JSON.parse(localStorage.getItem('profile'));

    useEffect(() => {
        if (post) {
            setPostData({
                title: post.title || '',
                message: post.message || '',            // Not setting message for now because it gives error and ruins the rest also
                tags: post.tags || '',
                selectedfile: post.selectedfile || '',
            });
        }
    }, [post]);

    const clearForm = () => {
        setCurrentId(0);
        setPostData({ title: '', message: '', tags: '', selectedfile: '' });
    };

    const toggleForm = () => {
        setformOpen(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (currentId === 0) {
            dispatch(createPost({ ...postData, name: user?.result?.name }));
            clearForm();
        } else {
            dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
            clearForm();
        }
    };

    if (!user?.result?.name) {
        return (
            <Paper className='paper' elevation={6} style={{ marginTop: '10px' }}>
                <Typography variant="h6" align="center" className='signintointeract'>
                    Sign in to post
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper className='paper' elevation={6} style={{ marginTop: '10px' }}>
            <form autoComplete="off" noValidate className='form' onSubmit={handleSubmit}>
                <div className='close' onClick={toggleForm}><CloseOutlinedIcon color='black' /></div>
                <Typography variant="h6" style={{ marginBottom: '7px', color: 'black' }} onClick={toggleForm}>
                    {currentId ? 'Edit' : 'Post'}
                </Typography>

                <TextField
                    name='title'
                    variant='outlined'
                    label="Title"
                    fullWidth
                    value={postData.title}
                    onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                    style={{ marginBottom: '7px', fontSize: '18px' }}
                />

                <ReactQuill
                    name='message'
                    value={postData.message}
                    onChange={(e) => setPostData({ ...postData, message: e })}
                    modules={{
                        toolbar: [
                            [{ header: [1, 2, false] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                            ['link', 'image'],
                            ['clean'],
                        ],
                    }}
                    formats={[
                        'header',
                        'bold', 'italic', 'underline', 'strike', 'blockquote',
                        'list', 'bullet', 'indent',
                        'link', 'image',
                    ]}

                    placeholder='Description'
                    style={{
                        marginBottom: '75px',
                        minHeight: '200px'
                    }}
                />

                <TextField
                    name='tags'
                    variant='outlined'
                    label="Tags"
                    fullWidth
                    value={postData.tags}
                    onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })}
                />

                <div className="fileInput">
                    <FileBase
                        type="file"
                        multiple={false}
                        onDone={({ base64 }) => setPostData({ ...postData, selectedfile: base64 })}
                    />
                </div>

                <Button
                    className='buttonSubmit'
                    variant='contained'
                    color='primary'
                    size='large'
                    type='submit'
                    fullWidth
                    style={{
                        marginBottom: '10px',
                        backgroundColor: 'black'
                    }}
                >
                    Post
                </Button>

                <Button
                    variant='outlined'
                    size='small'
                    onClick={clearForm}
                    fullWidth
                    style={{
                        backgroundColor: 'white',
                        color: 'black'
                    }}
                >
                    clear
                </Button>
            </form>
        </Paper>
    );
};

export default Form;