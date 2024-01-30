import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { userData } from '../../actions/auth';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import './userstyle.css';

const Userinfo = () => {

    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'))
    const id = user.result._id;

    useEffect(() => {
        dispatch(userData(id))
    }, [])

    const { clientData, isLoading } = useSelector((state) => state.authReducer)

    if (!clientData) {
        return null;
    }

    if (isLoading) {
        return (
            <CircularProgress className='loading' size='4rem' color='grey' />
        );
    }

    return (
        <div className="main-cont">
            <div className="upper-div">
                User info
            </div>
            <div className="lower-div">
                <div className='avatar'>
                    {clientData.name.charAt(0)}
                </div>
                <ul>
                    <li><span>UserName</span> : {clientData.name}</li>
                    <li><span>Email</span> : {clientData.email}</li>
                    <li><span>ID</span> : {clientData._id}</li>
                </ul>
            </div>
        </div>
    )
}

export default Userinfo;