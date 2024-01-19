import { AppBar, Avatar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import * as actionType from '../../constants/actionTypes';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './styles.css';


const Navbar = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        dispatch({ type: actionType.LOGOUT })
        navigate('/')
        setUser(null)
    }

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

    const openUser = () => {
        navigate(`/posts/${user.result._id}`)
    }

    useEffect(() => {
        const token = user?.token;

        if (token) {
            const decodedToken = jwtDecode(token)
            //  Time is in miliseconds thats why x1000
            if (decodedToken.exp * 1000 < new Date().getTime()) {
                logout();
            }
        }
        setUser(JSON.parse(localStorage.getItem('profile')))
    }, [location])

    return (
        <AppBar className="appBar" position="static" color="inherit">
            <div className='navbar'>
                <div className='brandContainer'>
                    <Typography component={Link} fontSize={35} to="/posts" className="heading" variant="h2" align="center">Memories</Typography>
                </div>
                <Toolbar className='toolbar'>
                    {user?.result ? (
                        <div className='profile'>
                            <Avatar onClick={openUser} className='purple' style={{ backgroundColor: 'grey' }} alt={user?.result.name} src={user?.result.imageUrl}>{user?.result.name.charAt(0)}</Avatar>
                            <Typography className='userName' variant="h6" style={{ fontSize: '18px' }}>{user?.result.name}</Typography>
                            <Button className='logout' style={{ margin: "0 10px", color: "black", backgroundColor: 'transparent', border: '1px solid grey' }} onClick={logout}>Logout</Button>
                        </div>
                    ) : (
                        <Button className='logout' component={Link} to="/auth" style={{ margin: "0 10px", color: "black", backgroundColor: 'transparent', border: '1px solid grey' }}>Sign In</Button>
                    )}
                </Toolbar>
            </div>
        </AppBar>
    )
}

export default Navbar