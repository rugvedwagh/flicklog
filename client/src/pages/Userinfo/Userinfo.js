import { CircularProgress, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { updateUserDetails } from '../../actions/auth.actions';
import { bookmarkPost } from '../../actions/post.actions';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './userinfo.styles.css';

const Userinfo = ({ darkMode }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { posts } = useSelector((state) => state.postsReducer);
    const { clientData, isLoading } = useSelector((state) => state.authReducer);

    const [showBm, setShowBm] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [formData, setFormData] = useState({
        name: clientData?.name || '',
        email: clientData?.email || ''
    });

    const bookmarkedPosts = useMemo(() => {
        return posts.filter((post) => clientData?.bookmarks?.includes(post._id));
    }, [posts, clientData]);

    const userPostsCount = useMemo(() => {
        return posts.filter((post) => post.creator === clientData?._id).length;
    }, [posts, clientData]);

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
    }, [dispatch, clientData, formData]);

    const handleCancel = useCallback(() => {
        setEditDialogOpen(false);
    }, []);

    const removeBookmark = (postId, userId) => {
        dispatch(bookmarkPost(postId, userId));
    }

    if (isLoading) {
        return <CircularProgress className={`loading ${darkMode ? 'dark' : ''}`} size="3rem" />;
    }

    if (!clientData) {
        return <h2>User does not exist!</h2>;
    }

    return (
        <div className={`main-cont ${darkMode ? 'dark' : ''}`}>
            <div className={`upper-div ${darkMode ? 'dark' : ''}`}>
                <h2>User Profile</h2>
            </div>
            <div className={`lower-div ${darkMode ? 'dark' : ''}`}>

                <div className={`avatar ${darkMode ? 'dark' : ''}`}>
                    {clientData.name.charAt(0).toUpperCase()}
                </div>

                <ul>
                    <li>
                        <strong>Username:</strong> <span>{clientData.name}</span>
                    </li>
                    <li>
                        <strong>Email:</strong> <span>{clientData.email}</span>
                    </li>
                    <li>
                        <strong>Posts:</strong> <span>{userPostsCount}</span>
                    </li>
                    <li>
                        <strong>Version:</strong> <span>{clientData.__v}</span>
                    </li>
                    <li>
                        <strong>Bookmarked Posts:</strong> <span>{clientData.bookmarks?.length}</span>
                    </li>
                    <li onClick={() => setShowBm((prev) => !prev)} sx={{ display: 'flex' }}>
                        <Button>
                            {showBm ? <span>Hide</span> : <span>Show bookmarked posts</span>}
                        </Button>
                        <Button onClick={handleEditUser}><span>Edit</span></Button>
                    </li>
                </ul>

                {bookmarkedPosts.length > 0 && showBm ? (
                    <div className="bookmarked-posts">
                        <hr />
                        <h3 className={`bookmark-heading ${darkMode ? 'dark' : ''}`}>Bookmarked Posts</h3>
                        <div className="bookmarked-list">
                            {bookmarkedPosts.map((post) => (
                                <div
                                    key={post._id}
                                    className={`bookmarked-post ${darkMode ? 'dark' : ''}`}
                                >
                                    <h4 onClick={() => openPost(post._id)}>
                                        {post.title.length > 40 ? post.title.slice(0, 40) + "..." : post.title}
                                    </h4>
                                    <CancelRoundedIcon color='error' onClick={() => removeBookmark(post._id, clientData._id)} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>

            <Dialog open={editDialogOpen} onClose={handleCancel}>

                <DialogTitle>Edit User Info</DialogTitle>

                <DialogContent>
                    <TextField
                        name="name"
                        label="Username"
                        value={formData.name}
                        onChange={handleFormChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        name="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleFormChange}
                        fullWidth
                        margin="normal"
                    />

                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCancel} color="secondary">
                        Cancel
                    </Button>

                    <Button onClick={saveChanges} color="primary" variant="contained">
                        Save
                    </Button>
                </DialogActions>

            </Dialog>
        </div>
    );
};

export default Userinfo;