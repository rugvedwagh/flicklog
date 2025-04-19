import { CircularProgress, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Collapse, Alert } from '@mui/material';
import { fetchUserData, updateUserDetails } from '../../redux/actions/user.actions';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import React, { useState, useEffect, useCallback } from 'react';
import { bookmarkPost } from '../../redux/actions/post.actions';
import { useTheme } from '../../context/themeContext';
import formatDate from '../../utils/formatDate';
import { useSelector, useDispatch } from 'react-redux';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { fetchUserProfile } from '../../utils/storage';
import { useNavigate } from 'react-router-dom';
import './userinfo.styles.css';

const Userinfo = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const darkMode = useTheme();

    const profile = fetchUserProfile();
    const userId = profile._id;

    const { clientData, isLoading } = useSelector((state) => state.userReducer);
    const { accessToken } = useSelector(state => state.authReducer);
    const { posts } = useSelector((state) => state.postsReducer);

    const [showBm, setShowBm] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

    const [formData, setFormData] = useState({
        name: clientData?.name || '',
        email: clientData?.email || ''
    });

    useEffect(() => {
        if (clientData?.bookmarks) {
            setBookmarkedPosts(posts.filter(post => clientData.bookmarks.includes(post._id)));
        }
    }, [clientData, posts]);

    const userPostsCount = posts.filter((post) => post.creator === clientData?._id).length;

    const openPost = useCallback((postId) => {
        navigate(`/posts/${postId}`);
    }, [navigate]);

    const handleEditUser = useCallback(() => {
        setFormData({
            name: clientData.name,
            email: clientData.email
        });
        setEditDialogOpen(true);
    }, [clientData]);

    const handleFormChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const saveChanges = useCallback(() => {
        dispatch(updateUserDetails(clientData._id, formData));
        setEditDialogOpen(false);
        setShowWelcome(true)
        const timer = setTimeout(() => setShowWelcome(false), 4000);
            return () => clearTimeout(timer);
    }, [dispatch, clientData, formData]);

    const handleCancel = useCallback(() => {
        setEditDialogOpen(false);
    }, []);

    const removeBookmark = (postId) => {
        dispatch(bookmarkPost(postId, clientData._id));
        setBookmarkedPosts((prev) => prev.filter(post => post._id !== postId));
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!clientData || clientData._id !== userId) {
            dispatch(fetchUserData(userId, navigate));
        }
    }, [dispatch, userId, navigate, accessToken]);

    if (isLoading) {
        return <CircularProgress className={`loading ${darkMode ? 'dark' : ''}`} size="3rem" />;
    }

    if (!clientData) {
        return <Typography sx={{ margin: '5rem 35%', color: '#666666' }} variant='h4'>User not found!</Typography>;
    }

    return (
        <div className='outer-cont'>
        <Collapse in={showWelcome}>
            <Alert variant="filled" icon={false} severity="success">
                Profile edited successfully
            </Alert>
        </Collapse>
            <ArrowBackOutlinedIcon id='backbutton' onClick={() => {
                navigate(-1)
            }} />

            <div className={`main-cont ${darkMode ? 'dark' : ''}`}>
                <div className={`upper-div ${darkMode ? 'dark' : ''}`}>
                    <h2>My Profile</h2>
                </div>

                <div className={`lower-div ${darkMode ? 'dark' : ''}`}>
                    <div className={`avatar ${darkMode ? 'dark' : ''}`}>
                        <i className="fa-solid fa-user"></i>
                    </div>
                    <h3 className={`username ${darkMode ? 'dark' : ''}`}>{clientData.name}</h3>
                    <ul>
                        <li><strong>Email:</strong> <span>{clientData.email}</span></li>
                        <li><strong>Posts:</strong> <span>{userPostsCount}</span></li>
                        <li><strong>Version:</strong> <span>{clientData.__v}</span></li>
                        <li><strong>Bookmarked Posts:</strong> <span>{bookmarkedPosts.length}</span></li>
                        <li><strong>Last updated on:</strong> <span>{formatDate(clientData.updatedAt)}</span></li>
                        <li onClick={() => setShowBm((prev) => !prev)} sx={{ display: 'flex' }}>
                            <Button>{showBm ? 'Hide' : 'Show bookmarked posts'}</Button>
                            <Button onClick={handleEditUser}>Edit</Button>
                        </li>
                    </ul>

                    {bookmarkedPosts.length > 0 && showBm && (
                        <div className="bookmarked-posts">
                            <hr />
                            <h3 className={`bookmark-heading ${darkMode ? 'dark' : ''}`}>Bookmarked Posts</h3>
                            <div className="bookmarked-list">
                                {bookmarkedPosts.map((post) => (
                                    <div key={post._id} className={`bookmarked-post ${darkMode ? 'dark' : ''}`}>
                                        <h4 onClick={() => openPost(post._id)}>
                                            {post.title.length > 40 ? post.title.slice(0, 40) + "..." : post.title}
                                        </h4>
                                        <CancelRoundedIcon color='error' onClick={() => removeBookmark(post._id)} id="crossButton" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <Dialog open={editDialogOpen} onClose={handleCancel}>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogContent>
                        <TextField name="name" label="Username" value={formData.name} onChange={handleFormChange} fullWidth margin="normal" />
                        <TextField name="email" label="Email" value={formData.email} onChange={handleFormChange} fullWidth margin="normal" />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancel} color="secondary">Cancel</Button>
                        <Button onClick={saveChanges} color="primary" variant="contained">Save</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default Userinfo;
