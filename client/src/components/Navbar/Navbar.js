import { AppBar, Avatar, Toolbar, Button, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import { userData, Logout } from '../../actions/auth';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import './styles.css';

const Navbar = ({darkMode}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const userId = user?.result?._id
    
    const [openDialog, setOpenDialog] = useState(false);
    const [navclass, setNavclass] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLogout = useCallback(() => {
        dispatch(Logout(navigate));
        setUser(null);
        closeMenu();
        setOpenDialog(false);
    }, [dispatch, navigate]);

    useEffect(() => {
        const token = user?.token;

        const checkTokenExpiry = () => {
            if (token) {
                const decodedToken = jwtDecode(token);

                if (decodedToken.exp * 1000 < new Date().getTime()) {
                    handleLogout();
                }
            }
        };

        checkTokenExpiry();
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [handleLogout, user?.token, location]);

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
                    {user?.result ? (
                        <div className='profile'>
                            <span className="avatar-container">
                                <Avatar
                                    onClick={handleMenuClick}
                                    className={`menu ${darkMode ? 'dark' : ''}`}
                                    alt={user?.result.name}
                                    src={user?.result.imageUrl}
                                >
                                    {user?.result.name.charAt(0)}
                                </Avatar>
                            </span>

                            <Menu
                                sx={{ left: -10, top: 10 }}
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={closeMenu}
                                className='menu'
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                            >
                                <MenuItem onClick={openUser}> <AccountCircleRoundedIcon />&nbsp; Your account</MenuItem>
                                <MenuItem > <EditNoteRoundedIcon />&nbsp; Your posts</MenuItem>
                                <MenuItem onClick={() => setOpenDialog(true)}>  <LogoutRoundedIcon />&nbsp; Logout</MenuItem>
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
                        <Button variant="contained" onClick={() => { setOpenDialog(false); closeMenu() }} style={{
                            color: 'white',
                            backgroundColor: 'black'
                        }} >
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleLogout} style={{
                            color: 'white',
                            backgroundColor: 'black'
                        }} autoFocus>
                            Logout
                        </Button>
                    </DialogActions>

                </Dialog>

            </div>
        </AppBar>
    );
};

export default Navbar;
