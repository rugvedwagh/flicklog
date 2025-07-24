import {
    CircularProgress,
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material"
import { fetchUserData, updateUserDetails } from "../../redux/actions/user.actions"
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined"
import { useState, useEffect, useCallback } from "react"
import { bookmarkPost } from "../../redux/actions/post.actions"
import { useTheme } from "../../context/themeContext"
import { formatDate } from "../../utils/formatDate"
import { useSelector, useDispatch } from "react-redux"
import CancelRoundedIcon from "@mui/icons-material/CancelRounded"
import { fetchUserProfile } from "../../utils/storage"
import { useNavigate } from "react-router-dom"
import "./userinfo.styles.css"

const Userinfo = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const darkMode = useTheme()
    const profile = fetchUserProfile()
    const userId = profile._id
    const { clientData, isLoading } = useSelector((state) => state.userReducer)
    const { accessToken } = useSelector((state) => state.authReducer)
    const { posts } = useSelector((state) => state.postsReducer)
    const [showBm, setShowBm] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [bookmarkedPosts, setBookmarkedPosts] = useState([])
    const [formData, setFormData] = useState({
        name: clientData?.name || "",
        email: clientData?.email || "",
    })

    useEffect(() => {
        if (clientData?.bookmarks) {
            setBookmarkedPosts(posts.filter((post) => clientData.bookmarks.includes(post._id)))
        }
    }, [clientData, posts])

    const userPostsCount = posts.filter((post) => post.creator === clientData?._id).length

    const openPost = useCallback(
        (postId) => {
            navigate(`/posts/${postId}`)
        },
        [navigate],
    )

    const handleEditUser = useCallback(() => {
        setFormData({
            name: clientData.name,
            email: clientData.email,
        })
        setEditDialogOpen(true)
    }, [clientData])

    const handleFormChange = useCallback((e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }, [])

    const saveChanges = useCallback(() => {
        dispatch(updateUserDetails(clientData._id, formData))
        setEditDialogOpen(false)
    }, [dispatch, clientData, formData])

    const handleCancel = useCallback(() => {
        setEditDialogOpen(false)
    }, [])

    const removeBookmark = (postId) => {
        dispatch(bookmarkPost(postId, clientData._id))
        setBookmarkedPosts((prev) => prev.filter((post) => post._id !== postId))
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        if (!clientData || clientData._id !== userId) {
            dispatch(fetchUserData(userId, navigate))
        }
    }, [dispatch, userId, navigate, accessToken])

    if (isLoading) {
        return (
            <div className="loading-container">
                <CircularProgress className={`loading ${darkMode ? "dark" : ""}`} size="3rem" />
            </div>
        )
    }

    if (!clientData) {
        return (
            <div className="error-container">
                <Typography variant="h4" className="error-text">
                    User not found!
                </Typography>
            </div>
        )
    }

    return (
        <div className={`page-container ${darkMode ? "dark" : ""}`}>
            <div className="header-section">
                <ArrowBackOutlinedIcon className={`back-button-userinfo ${darkMode ? "dark" : ""}`} onClick={() => navigate(-1)} />
            </div>

            <div className={`profile-container ${darkMode ? "dark" : ""}`}>
                {/* Profile Header Card */}
                <div className={`profile-header-card ${darkMode ? "dark" : ""}`}>
                    <div className={`avatar-large ${darkMode ? "dark" : ""}`}>
                        <i className="fa-solid fa-user"></i>
                    </div>
                    <h2 className={`username-large ${darkMode ? "dark" : ""}`}>{clientData.name}</h2>
                    <p className={`user-email ${darkMode ? "dark" : ""}`}>{clientData.email}</p>
                    <Button variant="outlined" onClick={handleEditUser} className={`edit-profile-btn ${darkMode ? "dark" : ""}`}>
                        Edit Profile
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className={`stat-card ${darkMode ? "dark" : ""}`}>
                        <div className={`stat-number ${darkMode ? "dark" : ""}`}>{userPostsCount}</div>
                        <div className={`stat-label ${darkMode ? "dark" : ""}`}>Posts Created</div>
                    </div>
                    <div className={`stat-card ${darkMode ? "dark" : ""}`}>
                        <div className={`stat-number ${darkMode ? "dark" : ""}`}>{bookmarkedPosts.length}</div>
                        <div className={`stat-label ${darkMode ? "dark" : ""}`}>Bookmarked</div>
                    </div>
                    <div className={`stat-card ${darkMode ? "dark" : ""}`}>
                        <div className={`stat-number ${darkMode ? "dark" : ""}`}>{clientData.__v}</div>
                        <div className={`stat-label ${darkMode ? "dark" : ""}`}>Version</div>
                    </div>
                </div>

                {/* Account Info Card */}
                <div className={`info-card ${darkMode ? "dark" : ""}`}>
                    <h3 className={`card-title ${darkMode ? "dark" : ""}`}>Account Information</h3>
                    <div className="info-row">
                        <span className={`info-label ${darkMode ? "dark" : ""}`}>Last Updated:</span>
                        <span className={`info-value ${darkMode ? "dark" : ""}`}>{formatDate(clientData.updatedAt)}</span>
                    </div>
                </div>

                {/* Bookmarks Section */}
                <div className={`bookmarks-card ${darkMode ? "dark" : ""}`}>
                    <div className="bookmarks-header">
                        <h3 className={`card-title ${darkMode ? "dark" : ""}`}>Bookmarked Posts</h3>
                        <Button
                            variant="text"
                            onClick={() => setShowBm((prev) => !prev)}
                            className={`toggle-btn ${darkMode ? "dark" : ""}`}
                        >
                            {showBm ? "Hide" : "Show"} ({bookmarkedPosts.length})
                        </Button>
                    </div>

                    {bookmarkedPosts.length > 0 && showBm && (
                        <div className="bookmarks-list">
                            {bookmarkedPosts.map((post) => (
                                <div key={post._id} className={`bookmark-item ${darkMode ? "dark" : ""}`}>
                                    <div className="bookmark-content" onClick={() => openPost(post._id)}>
                                        <h4 className={`bookmark-title ${darkMode ? "dark" : ""}`}>
                                            {post.title.length > 50 ? post.title.slice(0, 50) + "..." : post.title}
                                        </h4>
                                    </div>
                                    <CancelRoundedIcon className="remove-bookmark-btn" onClick={() => removeBookmark(post._id)} />
                                </div>
                            ))}
                        </div>
                    )}

                    {bookmarkedPosts.length === 0 && showBm && (
                        <div className={`empty-bookmarks ${darkMode ? "dark" : ""}`}>
                            <p>No bookmarked posts yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        name="name"
                        label="Username"
                        value={formData.name}
                        onChange={handleFormChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        name="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleFormChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={saveChanges} sx={{ backgroundColor: '#1a1a1a' }} variant="contained">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Userinfo
