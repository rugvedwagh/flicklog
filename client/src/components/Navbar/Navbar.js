import { AppBar, Avatar, Toolbar, Button, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { likedPosts, userPosts } from '../../actions/post.actions';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import React, { useState, useEffect, useCallback } from 'react';
import { userData, Logout } from '../../actions/auth.actions';
import { useNavigate, useLocation } from 'react-router-dom';
import { toggleTheme } from '../../actions/theme.actions';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie'
import './navbar.styles.css';

const Navbar = ({ darkMode }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const User = Cookies.get('refreshToken');
    const [profile, setProfile] = useState(JSON.parse(localStorage.getItem('profile')));
    const userId = profile?.result?._id

    const [openDialog, setOpenDialog] = useState(false);
    const [navclass, setNavclass] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);

    const toggleView = () => {
        dispatch(toggleTheme());
    };

    const handleLogout = useCallback(() => {
        dispatch(Logout(navigate));
        setProfile(null);
        closeMenu();
        setOpenDialog(false);
    }, [dispatch, navigate]);

    useEffect(() => {
        const token = profile?.token;

        const checkAccessTokenExpiry = () => {
            if (token) {
                const decodedToken = jwtDecode(token);

                if (decodedToken.exp * 1000 < new Date().getTime()) {
                    handleLogout();
                }
            }
        };

        checkAccessTokenExpiry();
        setProfile(JSON.parse(localStorage.getItem('profile')));
    }, [handleLogout, profile?.token, location]);

    const handleLoginClick = () => {
        navigate('/auth')
    }

    const openUser = () => {
        dispatch(userData(userId, navigate));
        closeMenu();
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const handleLogoClick = () => {
        navigate('/posts')
    }

    const handleLikedPosts = () => {
        dispatch(likedPosts(userId));
        closeMenu()
    }

    const handleUserPosts = () => {
        dispatch(userPosts(userId));
        closeMenu()
    }

    let lastScrollY = window.scrollY;
    const scrollThreshold = 300;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
            setNavclass(true);
        } else if (currentScrollY < lastScrollY) {
            setNavclass(false);
        }

        lastScrollY = currentScrollY;
    });

    return (
        <AppBar className={`appBar ${navclass ? 'blur' : ''} ${darkMode ? 'dark' : ''}`}>

            <div className={`navbar ${darkMode ? 'dark' : ''}`}>

                <div className={`brandContainer ${darkMode ? 'dark' : ''}`} onClick={handleLogoClick}>
                    reminisce
                </div>

                <Toolbar className='toolbar'>
                    {User ? (
                        <div className='profile'>
                            <span className="avatar-container">
                                <Avatar
                                    onClick={handleMenuClick}
                                    className={`menu ${darkMode ? 'dark' : ''}`}
                                    alt={profile?.result?.name}
                                    src={profile?.result?.imageUrl}
                                >
                                    {profile?.result?.name.charAt(0)}
                                </Avatar>
                            </span>

                            <Menu
                                sx={{ left: -45, top: 5 }}
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={closeMenu}
                                className={`menuRoot ${darkMode ? 'dark' : ''}`}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            >
                                <MenuItem onClick={openUser} >
                                    <Avatar
                                        onClick={handleMenuClick}
                                        alt={profile?.result?.name}
                                        src={profile?.result?.imageUrl}
                                    >
                                        {profile?.result?.name.charAt(0)}
                                    </Avatar>&nbsp;
                                    <div className='userinfo'>
                                        <strong>
                                            {profile?.result?.name}<br></br>
                                        </strong>
                                        <small>
                                            {profile?.result?.email}
                                        </small>
                                    </div>
                                </MenuItem>
                                <MenuItem onClick={openUser}> <AccountCircleOutlinedIcon />&nbsp; My account</MenuItem>
                                <MenuItem onClick={handleLikedPosts}> <ThumbUpAltOutlinedIcon />&nbsp; Liked posts</MenuItem>
                                <MenuItem onClick={handleUserPosts}> <EditNoteOutlinedIcon />&nbsp; My posts</MenuItem>
                                <MenuItem> <SettingsOutlinedIcon />&nbsp; Settings</MenuItem>
                                <MenuItem onClick={toggleView}>
                                    {darkMode ? <><LightModeIcon />&nbsp; Light Mode</> : <><DarkModeIcon />&nbsp; Dark Mode</>}
                                </MenuItem>
                                <MenuItem onClick={() => setOpenDialog(true)}>  <LogoutRoundedIcon />&nbsp; Log out</MenuItem>
                            </Menu>
                        </div>
                    ) : (

                        <div className={`logout ${darkMode ? 'dark' : ''}`} onClick={handleLoginClick}>
                            Log in
                        </div>
                    )}

                </Toolbar>

                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Are you sure you want to log out?"}</DialogTitle>

                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Logging out will clear your session.
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button variant="contained" onClick={() => { setOpenDialog(false); closeMenu() }} >
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleLogout} autoFocus>
                            Log out
                        </Button>
                    </DialogActions>

                </Dialog>

            </div>
        </AppBar>
    );
};

export default Navbar;