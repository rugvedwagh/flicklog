import { createPost, updatePost } from '../../redux/actions/post.actions';
import { TextField, Button, Typography, Paper } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { getRefreshToken } from '../../utils/getTokens'
import { useTheme } from '../../context/themeContext';
import React, { useState, useEffect } from 'react';
import { getProfile } from '../../utils/storage';
import 'react-quill/dist/quill.snow.css';
import FileBase from 'react-file-base64';
import ReactQuill from 'react-quill';
import './form.styles.css';


const Form = ({ currentId, setCurrentId, setformOpen }) => {

    const dispatch = useDispatch();
    const darkModObj = useTheme();
    const darkMode = darkModObj.darkMode;

    const profile = getProfile();
    const UserIsAuthenticated = getRefreshToken()

    const post = useSelector((state) => (currentId ?
        state.postsReducer.posts.find((message) => message._id === currentId)
        : null));

    const [postData, setPostData] = useState({
        title: '',
        message: '',
        tags: '',
        selectedfile: '',
    });

    useEffect(() => {
        if (post) {
            setPostData({
                title: post.title || '',
                message: post.message || '',
                tags: post.tags || '',
                selectedfile: post.selectedfile || ''
            });
        }
    }, [post]);

    const clearForm = () => {
        setCurrentId(0);
        setPostData({
            title: "",
            message: '',
            tags: [],
            selectedfile: ''
        });
    };

    const toggleForm = () => {
        setformOpen(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        (currentId === 0) ?
            dispatch(createPost({ ...postData, name: profile.name })) :
            dispatch(updatePost(currentId, { ...postData, name: profile.name }));

        clearForm();
    };

    if (!UserIsAuthenticated) {
        return (
            <Paper className={`paper ${darkMode ? 'dark' : ''}`} elevation={6}>
                <Typography variant="h6" align="center">
                    Sign in to post
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper className={`paper ${darkMode ? 'dark' : ''}`} elevation={6} >
            <form autoComplete="off" noValidate className={`form ${darkMode ? 'dark' : ''}`} onSubmit={handleSubmit}>

                <div className={`close ${darkMode ? 'dark' : ''}`} onClick={toggleForm}>
                    <CloseOutlinedIcon color='black' />
                </div>

                <Typography variant="h6" onClick={toggleForm} gutterBottom>
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
                    className={`descinp ${darkMode ? 'dark' : ''}`}
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
                    className={`buttonSubmit ${darkMode ? 'dark' : ''} `}
                    variant='contained'
                    color='primary'
                    size='large'
                    type='submit'
                    fullWidth
                    style={{

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
