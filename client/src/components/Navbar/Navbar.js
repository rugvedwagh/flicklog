import { AppBar, Avatar, Toolbar, Typography, Button, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DensityMediumOutlinedIcon from '@mui/icons-material/DensityMediumOutlined';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import * as actionType from '../../constants/actionTypes';
import LogoutIcon from '@mui/icons-material/Logout';
import React, { useState, useEffect } from 'react';
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

    const Logout = () => {
        dispatch({ type: actionType.LOGOUT });
        navigate('/');
        setUser(null);
        handleMenuClose();
        setOpenDialog(false);
    }

    const openUser = () => {
        navigate(`/user/info/${user.result._id}`);
        handleMenuClose();
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const token = user?.token;

        if (token) {
            const decodedToken = jwtDecode(token);

            if (decodedToken.exp * 1000 < new Date().getTime()) {
                Logout();
            }
        }
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    return (
        <AppBar className="appBar" position="static" color="">
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
                                <Avatar className='purple' sx={{ bgcolor: 'white', color: '#C8102E' }} alt={user?.result.name} src={user?.result.imageUrl}>
                                    {user?.result.name.charAt(0)}
                                </Avatar>
                            </span>
                            <Typography className='userName' variant="h6" style={{ fontSize: '18px' }}>
                                {user?.result.name}
                            </Typography>
                            <div className='logout'>
                                <DensityMediumOutlinedIcon
                                    onClick={handleMenuClick}
                                />
                            </div>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem >Your posts</MenuItem>
                                <MenuItem onClick={openUser}>Your account &nbsp; <AccountCircleRoundedIcon /></MenuItem>
                                {/* <MenuItem onClick={setOpenDialog(true)}>Logout &nbsp; <LogoutIcon /></MenuItem> */}
                                <MenuItem onClick={() => setOpenDialog(true)}>Logout &nbsp; <LogoutIcon /></MenuItem>
                            </Menu>
                        </div>
                    ) : (
                        <Button
                            className='logout'
                            component={Link}
                            to="/auth"
                            variant='contained'
                            style={{ margin: "0 10px", color: "#C8102E", backgroundColor: 'white' }}
                        >
                            Sign In
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
                        <Button variant="contained" onClick={() => { setOpenDialog(false); handleMenuClose() }} style={{ color: '#C8102E', backgroundColor: 'transparent' }}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={Logout} style={{ color: '#C8102E', backgroundColor: 'transparent' }} autoFocus>
                            Logout
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </AppBar>
    );
};

export default Navbar;
