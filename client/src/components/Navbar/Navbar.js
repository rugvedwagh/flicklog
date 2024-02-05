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

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

    const Logout = () => {
        dispatch({ type: actionType.LOGOUT })
        navigate('/')
        setUser(null)
    }

    const openUser = () => {
        navigate(`/user/info/${user.result._id}`)
    }

    useEffect(() => {

        const token = user?.token;

        if (token) {
            const decodedToken = jwtDecode(token)

            if (decodedToken.exp * 1000 < new Date().getTime()) {
                Logout();
            }
        }
        setUser(JSON.parse(localStorage.getItem('profile')))
    }, [location])

    return (
        <AppBar className="appBar" position="static" color="inherit">
            <div className='navbar'>
                <div className='brandContainer'>
                    <Link to="/posts" className='headingcontainer'>
                        <div className="heading" align="center" style={{ textAlign: 'center' }}>reminisce</div>
                    </Link>
                </div>
                <Toolbar className='toolbar'>
                    {user?.result ? (
                        <div className='profile'>
                            <span className='avatarcontainer'>
                                <Avatar onClick={openUser} className='purple' style={{ backgroundColor: '#ff00ae' }} alt={user?.result.name} src={user?.result.imageUrl}>
                                    {user?.result.name.charAt(0)}
                                </Avatar>
                            </span>
                            <Typography className='userName' variant="h6" style={{ fontSize: '18px' }}>
                                {user?.result.name}
                            </Typography>
                            <Button className='logout' variant='contained' style={{ margin: "0 10px", color: "#C8102E", backgroundColor: 'white' }} onClick={Logout}>
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Button className='logout' component={Link} to="/auth" variant='contained' style={{ margin: "0 10px", color: "#C8102E", backgroundColor: 'white' }}>
                            Sign In
                        </Button>
                    )}
                </Toolbar>
            </div>
        </AppBar>
    )
}

export default Navbar