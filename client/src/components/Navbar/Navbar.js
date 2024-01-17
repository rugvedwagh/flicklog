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

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('profile')))

        const token = user?.token;

        if (token) {
            const decodedToken = jwtDecode(token)
            // time is in miliseconds thats why x1000
            if (decodedToken.exp * 1000 < new Date().getTime()) {
                logout();
            }
        }
    }, [location])

    return (
        <AppBar className="appBar" position="static" color="inherit">
            <div className='navbar'>
                <div className='brandContainer'>
                    <Typography component={Link} to="/" className="heading" variant="h2" align="center" fontSize={30}>Memories</Typography>
                    {/* <img style={{height:'40px', width:'40px',marginLeft:'5px'}} src={memories}/> */}
                </div>
                <Toolbar className='toolbar'>
                    {user?.result ? (
                        <div className='profile'>
                            <Avatar className='purple' alt={user?.result.name} src={user?.result.imageUrl}>{user?.result.name.charAt(0)}</Avatar>
                            <Typography className='userName' variant="h6">{user?.result.name}</Typography>
                            <Button variant="contained" className='logout' style={{ margin: "0 10px", color: "white" }} onClick={logout}>Logout</Button>
                        </div>
                    ) : (
                        <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
                    )}
                </Toolbar>
            </div>
        </AppBar>
    )
}

export default Navbar