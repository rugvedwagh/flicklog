import { useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigate hook
import './userstyle.css';

const Userinfo = () => {
    const { clientData, isLoading } = useSelector((state) => state.authReducer);
    const { posts } = useSelector((state) => state.posts);
    const navigate = useNavigate(); // Use navigate hook for navigation
    const [showBm, setShowbm] = useState(false);

    if (isLoading) {
        return (
            <CircularProgress className="loading" size="3rem" color="grey" />
        );
    }

    if (!clientData) {
        return (
            <h2>User does not exist!</h2>
        );
    }

    const bookmarkedPosts = posts.filter(post => clientData.bookmarks?.includes(post._id));

    const openPost = (postId) => {
        navigate(`/posts/${postId}`);
    };

    return (
        <div className="main-cont">
            <div className="upper-div">
                <h2>User Info</h2>
            </div>
            <div className="lower-div">
                <div className="avatar">
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
                        <strong>Posts:</strong> <span>{posts.filter((post) => post.creator === clientData._id).length}</span>
                    </li>
                    {/* <li>
                        <strong>User ID:</strong> <span>{clientData._id}</span>
                    </li> */}
                    <li>
                        <strong>Version:</strong> <span>{clientData.__v}</span>
                    </li>
                    <li>
                        <strong>Bookmarked Posts:</strong> <span>{clientData.bookmarks?.length}</span>
                    </li>
                    <li onClick={() => setShowbm(!showBm)}> {/* Toggle the state */}
                        {showBm ? <span>hide</span> : <span>show</span>} {/* Conditional rendering */}
                    </li>
                </ul>

                {/* Display Bookmarked Posts */}
                {bookmarkedPosts.length > 0 && showBm ? (
                    <div className="bookmarked-posts">
                        <hr></hr>
                        <h3>Bookmarked Posts</h3>
                        <div className="bookmarked-list">
                            {bookmarkedPosts.map((post) => (
                                <div
                                    key={post._id}
                                    className="bookmarked-post"
                                    onClick={() => openPost(post._id)} // Navigate to post detail
                                >
                                    <strong>{post.title}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};

export default Userinfo;
