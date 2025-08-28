import {
    Avatar,
    Button,
    Menu,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Typography,
} from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { likedPosts, userPosts } from "../../redux/actions/post.actions";
import { Logout } from "../../redux/actions/auth.actions";
import LightModeIcon from "@mui/icons-material/LightMode";
import { fetchUserData } from "../../redux/actions/user.actions";
import { toggleTheme } from "../../redux/actions/theme.actions";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useState, useEffect, useCallback } from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { handleNavbarScroll } from "../../utils/scroll";
import { useNavigate } from "react-router-dom";
import Search from "../Search/Search";
import { useForm } from "../../context/formContext";
import { useTheme } from "../../context/themeContext";
import { fetchUserProfile } from "../../utils/storage";
import { useDispatch } from "react-redux";
import "./navbar.styles.css";
import { useSelector } from "react-redux";

const Navbar = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const darkMode = useTheme();
    const { setformopen } = useForm();
    const [openDialog, setOpenDialog] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [profile, setProfile] = useState(null);
    const userId = profile?._id;
    const { authData } = useSelector((state) => state.authReducer);

    useEffect(() => {
        const fetchProfile = async () => {
            setProfile(fetchUserProfile());
        };
        fetchProfile();
    }, [authData]);

    const toggleView = () => {
        dispatch(toggleTheme());
    };

    const handleLogout = useCallback(() => {
        sessionStorage.removeItem("welcomeShown");
        dispatch(Logout(navigate));
        closeMenu();
        setOpenDialog(false);
        navigate("/auth");
    }, [dispatch, navigate]);

    useEffect(() => {
        return handleNavbarScroll(setIsVisible);
    }, []);

    const handleLoginClick = () => {
        navigate("/auth");
    };

    const openUser = () => {
        if (userId) {
            dispatch(fetchUserData(userId, navigate));
            navigate("/user/info");
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
        navigate("/posts");
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
    };

    const navbarClasses = `navbar ${darkMode ? "dark" : ""} ${isVisible ? "visible" : "hidden"}`;

    return (
        <div className={navbarClasses}>
            {/* Brand/Logo - Left Side */}
            <div className={`brand-container ${darkMode ? "dark" : ""}`} onClick={handleLogoClick}>
                <Typography variant="h4" className={`brand-text ${darkMode ? "dark" : ""}`}>
                    Flicklog
                </Typography>
            </div>

            {/* Spacer - Middle */}
            <div className="navbar-spacer"></div>

            {/* Content - Right Side */}
            {userId ? (
                <div className={`navbar-content ${darkMode ? "dark" : ""}`}>
                    <div className={`profile-section ${darkMode ? "dark" : ""}`}>
                        <div className="search-container">
                            <Search darkMode={darkMode} />
                        </div>

                        <Avatar
                            onClick={handleMenuClick}
                            className={`profile-avatar ${darkMode ? "dark" : ""}`}
                            alt={profile?.name}
                            src={profile?.imageUrl}
                        >
                            {profile?.name?.charAt(0)}
                        </Avatar>
                    </div>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={closeMenu}
                        className={`profile-menu ${darkMode ? "dark" : ""}`}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                        PaperProps={{
                            className: `menu-paper ${darkMode ? "dark" : ""}`,
                        }}
                    >
                        <div className={`user-info-header ${darkMode ? "dark" : ""}`}>
                            <Avatar
                                className={`user-avatar-large ${darkMode ? "dark" : ""}`}
                                alt={profile?.name}
                                src={profile?.imageUrl}
                            >
                                {profile?.name?.charAt(0)}
                            </Avatar>
                            <div className="user-details">
                                <Typography variant="h6" className={`user-name ${darkMode ? "dark" : ""}`}>
                                    {profile?.name}
                                </Typography>
                                <Typography variant="body2" className={`user-email ${darkMode ? "dark" : ""}`}>
                                    {profile?.email}
                                </Typography>
                            </div>
                        </div>

                        <Divider className={`menu-divider ${darkMode ? "dark" : ""}`} />

                        <MenuItem onClick={openUser} className={`menu-item ${darkMode ? "dark" : ""}`}>
                            <AccountCircleOutlinedIcon className="menu-icon" />
                            <span>My Account</span>
                        </MenuItem>

                        <MenuItem onClick={openForm} className={`menu-item ${darkMode ? "dark" : ""}`}>
                            <AddCircleOutlineOutlinedIcon className="menu-icon" />
                            <span>New post</span>
                        </MenuItem>

                        <MenuItem onClick={handleUserPosts} className={`menu-item ${darkMode ? "dark" : ""}`}>
                            <EditNoteOutlinedIcon className="menu-icon" />
                            <span>My Posts</span>
                        </MenuItem>

                        <MenuItem onClick={handleLikedPosts} className={`menu-item ${darkMode ? "dark" : ""}`}>
                            <ThumbUpAltOutlinedIcon className="menu-icon" />
                            <span>Liked Posts</span>
                        </MenuItem>

                        <MenuItem onClick={() => navigate("/user/info")} className={`menu-item ${darkMode ? "dark" : ""}`}>
                            <SettingsOutlinedIcon className="menu-icon" />
                            <span>Settings</span>
                        </MenuItem>

                        <Divider className={`menu-divider ${darkMode ? "dark" : ""}`} />

                        <MenuItem onClick={toggleView} className={`menu-item ${darkMode ? "dark" : ""}`}>
                            {darkMode ? <LightModeIcon className="menu-icon" /> : <DarkModeIcon className="menu-icon" />}
                            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                        </MenuItem>

                        <MenuItem
                            onClick={() => setOpenDialog(true)}
                            className={`menu-item logout-item ${darkMode ? "dark" : ""}`}
                        >
                            <LogoutRoundedIcon className="menu-icon" />
                            <span>Log Out</span>
                        </MenuItem>
                    </Menu>
                </div>
            ) : (
                <Button
                    variant="contained"
                    onClick={handleLoginClick}
                    className={`login-btn ${darkMode ? "dark" : ""}`}
                    sx={{ marginLeft: 'auto' }}
                >
                    Log In
                </Button>
            )}

            {/* Logout Confirmation Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                className={`logout-dialog ${darkMode ? "dark" : ""}`}
                PaperProps={{
                    className: `dialog-paper ${darkMode ? "dark" : ""}`,
                }}
            >
                <DialogTitle className={`dialog-title ${darkMode ? "dark" : ""}`}>Confirm Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText className={`dialog-text ${darkMode ? "dark" : ""}`}>
                        Are you sure you want to log out? This will end your current session.
                    </DialogContentText>
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button
                        onClick={() => {
                            setOpenDialog(false);
                            closeMenu();
                        }}
                        variant="outlined"
                        className={`cancel-butn ${darkMode ? "dark" : ""}`}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleLogout}
                        variant="contained"
                        className={`confirm-btn ${darkMode ? "dark" : ""}`}
                        autoFocus
                    >
                        Log Out
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Navbar;