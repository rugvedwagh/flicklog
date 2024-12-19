import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { userData } from '../../actions/auth';
import React, { useEffect } from 'react';
import './userstyle.css';

const Userinfo = () => {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const { clientData, isLoading } = useSelector((state) => state.authReducer);
    const { posts } = useSelector((state) => state.posts);
    const userId = user.result._id;

    useEffect(() => {
        dispatch(userData(userId));
    }, [dispatch, userId]);


    if (isLoading) {
        return (
            <CircularProgress className="loading" size="3rem" color="grey" />
        );
    }

    if (!clientData) {
        return null;
    }

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
                    <li>
                        <strong>User ID:</strong> <span>{clientData._id}</span>
                    </li>
                    <li>
                        <strong>Version:</strong> <span>{clientData.__v}</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Userinfo;