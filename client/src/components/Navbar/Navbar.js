import { Avatar, Button, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { likedPosts, userPosts } from '../../redux/actions/post.actions';
import { Logout } from '../../redux/actions/auth.actions';
import LightModeIcon from '@mui/icons-material/LightMode';
import { fetchUserData } from '../../redux/actions/user.actions';
import { toggleTheme } from '../../redux/actions/theme.actions';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import React, { useState, useEffect, useCallback } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { handleNavbarScroll } from '../../utils/scroll';
import Search from '../Search/Search';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../utils/storage';
import { useForm } from '../../context/formContext';
import { useTheme } from '../../context/themeContext';
import { useDispatch, useSelector } from 'react-redux';
import './navbar.styles.css';

const Navbar = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const darkMode = useTheme();

    const { authData } = useSelector((state) => state.authReducer);
    const { formopen, setformopen } = useForm();

    const [openDialog, setOpenDialog] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [profile, setProfile] = useState();

    const userId = profile?._id;

    useEffect(() => {
        const fetchProfile = async () => {
            setProfile(getProfile());
        };

        fetchProfile();
    }, [authData]);

    const toggleView = () => {
        dispatch(toggleTheme());
    };

    const handleLogout = useCallback(() => {
        dispatch(Logout(navigate));
        closeMenu();
        setOpenDialog(false);
        navigate('/auth')
    }, [dispatch, navigate]);

    useEffect(() => {
        return handleNavbarScroll(setIsVisible);
    }, []);

    const handleLoginClick = () => {
        navigate('/auth');
    };

    const openUser = () => {
        if (userId) {
            dispatch(fetchUserData(userId, navigate));
            navigate('/user/i')
            closeMenu();
        }
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const handleLogoClick = () => {
        navigate('/posts');
    };

    const handleLikedPosts = () => {
        if (userId) {
            dispatch(likedPosts(userId));
            closeMenu();
        }
    };

    const handleUserPosts = () => {
        if (userId) {
            dispatch(userPosts(userId));
            closeMenu();
        }
    };

    const openForm = () => {
        setformopen(true);
        closeMenu();
    }

    const navbarClasses = `navbar ${darkMode ? 'dark' : ''} ${isVisible ? 'visible' : 'hidden'}`;

    return (
        <div className={navbarClasses}>
            <div className={`brandContainer ${darkMode ? 'dark' : ''}`} onClick={handleLogoClick}>
                Flicklog
            </div>

            {userId ? (
                <div className='profile'>
                    <Search darkMode={darkMode} />

                    <Avatar
                        onClick={handleMenuClick}
                        className={`profileAvatar ${darkMode ? 'dark' : ''}`}
                        alt={profile.name}
                        src={profile.imageUrl}
                    >
                        {profile.name?.charAt(0)}
                    </Avatar>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={closeMenu}
                        className={`menuRoot ${darkMode ? 'dark' : ''}`}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <MenuItem onClick={openUser}>
                            <Avatar
                                alt={profile?.name}
                                src={profile.imageUrl}
                            >
                                <i className="fa-solid fa-user" style={{ color: '#1a1a1a' }}></i>
                            </Avatar>&nbsp;
                            <div className='userinfo'>
                                <strong>
                                    {profile?.name}<br />
                                </strong>
                                <small>
                                    {profile.email}
                                </small>
                            </div>
                        </MenuItem>
                        <MenuItem onClick={openUser}><AccountCircleOutlinedIcon />&nbsp; My account</MenuItem>
                        <MenuItem onClick={openForm}><AddCircleOutlineOutlinedIcon />&nbsp; New post</MenuItem>
                        <MenuItem onClick={handleLikedPosts}><ThumbUpAltOutlinedIcon />&nbsp; Liked posts</MenuItem>
                        <MenuItem onClick={handleUserPosts}><EditNoteOutlinedIcon />&nbsp; My posts</MenuItem>
                        <MenuItem onClick={() => { navigate('/user/i') }}><SettingsOutlinedIcon />&nbsp; Settings</MenuItem>
                        <MenuItem onClick={toggleView}>
                            {darkMode ? <><LightModeIcon />&nbsp; Light Mode</> : <><DarkModeIcon />&nbsp; Dark Mode</>}
                        </MenuItem>
                        <MenuItem onClick={() => setOpenDialog(true)}><LogoutRoundedIcon />&nbsp; Log out</MenuItem>
                    </Menu>
                </div>
            ) : (
                <div className={`logout ${darkMode ? 'dark' : ''}`} onClick={handleLoginClick}>
                    Log in
                </div>
            )}

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to log out?"}
                </DialogTitle>

                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Logging out will clear your session.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button variant="contained" onClick={() => { setOpenDialog(false); closeMenu(); }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleLogout} autoFocus>
                        Log out
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Navbar;
