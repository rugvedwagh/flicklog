import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { userData } from '../../actions/auth';
import React, { useEffect } from 'react';
import './userstyle.css';

const Userinfo = () => {

    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'))
    const userId = user.result._id;

    useEffect(() => {
        dispatch(userData(userId))
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
                <strong>User Info</strong>
            </div>
            <div className="lower-div">
                <div className='avatar'>
                    {clientData.name.charAt(0)}
                </div>
                <ul>
                    <li><strong>UserName</strong> : {clientData.name}</li>
                    <li><strong>Email</strong> : {clientData.email}</li>
                    <li><strong>version</strong> : {clientData.__v}</li>
                    <li><strong>Id</strong> : {clientData._id}</li>
                </ul>
            </div>
        </div>
    )
}

export default Userinfo;