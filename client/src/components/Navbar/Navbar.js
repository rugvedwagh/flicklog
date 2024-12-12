import { AppBar, Avatar, Toolbar, Button, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import * as actionType from '../../constants/actionTypes';
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
        <AppBar className="appBar" position="static">
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
                                <Avatar onClick={handleMenuClick} className='purple' sx={{ bgcolor: 'white', color: 'black' }} alt={user?.result.name} src={user?.result.imageUrl}>
                                    {user?.result.name.charAt(0)}
                                </Avatar>
                            </span>
                            <Menu
                                sx={{ left : -10, top : 10 }}
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                className='menu'
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                            >
                                <MenuItem>
                                    <Avatar className='purple' color="primary" sx={{ bgcolor: '#212121', color: 'white', width: 28, height: 28 }} alt={user?.result.name} src={user?.result.imageUrl}>
                                        {user?.result.name.charAt(0)}
                                    </Avatar>
                                    <span>
                                        {user?.result.name}
                                    </span>
                                </MenuItem>
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
                            style={{ margin: "0 10px", color: "black", backgroundColor: 'white' }}
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
                        <Button variant="contained" onClick={() => { setOpenDialog(false); handleMenuClose() }} style={{ color: 'white', backgroundColor: 'black' }} >
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={Logout} style={{ color: 'white', backgroundColor: 'black' }} autoFocus>
                            Logout
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </AppBar>
    );
};

export default Navbar;
