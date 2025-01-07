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

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [navclass, setNavclass] = useState('appBar')

    const userId = user?.result?._id

    const handleLogout = useCallback(() => {
        dispatch(Logout(navigate));
        setUser(null);
        closeMenu();
        setOpenDialog(false);
    }, [dispatch, navigate]);

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

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY) {
            setNavclass('appBar-blur')
        } else if (currentScrollY < lastScrollY) {
            setNavclass('appBar')
        }
        lastScrollY = currentScrollY;
    });

    useEffect(() => {
        const token = user?.token;

        const checkTokenExpiry = () => {
            if (token) {
                const decodedToken = jwtDecode(token);

                if (decodedToken.exp * 1000 < new Date().getTime()) {
                    handleLogout(); // Safe to call because it's memoized.
                }
            }
        };

        checkTokenExpiry();
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [handleLogout, user?.token, location]);

    return (
        <AppBar className={navclass}>
            <div className='navbar'>
                <div className='brandContainer'>
                    <Link to="/posts" className='heading-container'>
                        <div className="heading" align="center" style={{
                            textAlign: 'center'
                        }}>
                            reminisce
                        </div>
                    </Link>
                </div>
                <Toolbar className='toolbar'>
                    {user?.result ? (
                        <div className='profile'>
                            <span className="avatar-container">
                                <Avatar
                                    onClick={handleMenuClick}
                                    className="profileAvatar"
                                    sx={{
                                        width: 45,
                                        height: 45,
                                        bgcolor: 'white',
                                        color: 'black',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                        textTransform: 'uppercase',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                            boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
                                        },
                                    }}
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
                        <Button
                            className='logout'
                            component={Link}
                            to="/auth"
                            variant='contained'
                            style={{
                                margin: "0 10px",
                                color: "black",
                                backgroundColor: 'white',
                                borderRadius: '3px',
                                textTransform: 'none'
                            }}
                        >
                            Log in
                        </Button>
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
