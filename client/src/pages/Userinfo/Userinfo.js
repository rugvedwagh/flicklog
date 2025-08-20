import {
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
import { formatDate } from "../../utils/format-date"
import { useSelector, useDispatch } from "react-redux"
import CancelRoundedIcon from "@mui/icons-material/CancelRounded"
import { fetchUserProfile } from "../../utils/storage"
import { useNavigate } from "react-router-dom"
import "./userinfo.styles.css"
import UserInfoSkeleton from "../../components/Skeletons/UserInfoSkeleton"

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
        const refetchUserData = async () => {
            await dispatch(fetchUserData(userId))
        }

        if (!clientData) {
            refetchUserData()
        }
    }, [])

    if (isLoading) {
        return (
            <UserInfoSkeleton darkMode={darkMode} />
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
            <Dialog
                open={editDialogOpen}
                onClose={handleCancel}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    style: {
                        borderRadius: '20px',
                        padding: '20px',
                        backgroundColor: darkMode ? '#2a2a2a' : '#e7e9ea',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                        border: '1px solid #e7e9ea'
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        color: darkMode ? '#fff' : '#333',
                    }}
                >
                    Edit Profile
                </DialogTitle>

                <DialogContent>
                    <TextField
                        name="name"
                        label="Username"
                        value={formData.name}
                        onChange={handleFormChange}
                        fullWidth
                        margin="dense"
                        variant="outlined"
                        InputProps={{
                            style: {
                                borderRadius: 12,
                                backgroundColor: darkMode ? '#1a1a1a' : '#fff',
                                color: darkMode ? '#ccc' : '#333',
                            },
                        }}
                        InputLabelProps={{
                            style: {
                                color: darkMode ? '#aaa' : '#666',
                            },
                        }}
                    />
                    <TextField
                        name="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleFormChange}
                        fullWidth
                        margin="dense"
                        variant="outlined"
                        InputProps={{
                            style: {
                                borderRadius: 12,
                                backgroundColor: darkMode ? '#1a1a1a' : '#fff',
                                color: darkMode ? '#ccc' : '#333',
                            },
                        }}
                        InputLabelProps={{
                            style: {
                                color: darkMode ? '#aaa' : '#666',
                            },
                        }}
                    />
                </DialogContent>

                <DialogActions sx={{ justifyContent: 'space-between', marginTop: 1 }}>
                    <Button
                        onClick={handleCancel}
                        variant="outlined"
                        sx={{
                            borderRadius: 8,
                            textTransform: 'none',
                            borderColor: darkMode ? '#777' : '#ccc',
                            color: darkMode ? '#ccc' : '#333',
                            '&:hover': {
                                borderColor: darkMode ? '#999' : '#999',
                            },
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={saveChanges}
                        variant="contained"
                        sx={{
                            backgroundColor: darkMode ? '#e7e9ea' : '#2e6f40',
                            color: darkMode ? '#1a1a1a' : '#e7e9ea',
                            borderRadius: 8,
                            textTransform: 'none',
                            boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
                            fontWeight: '600',
                            '&:hover': {
                                backgroundColor: darkMode ? '#2e6f40' : '#e7e9ea',
                                color: darkMode ? '#fff' : '#2e6f40',
                            },
                        }}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Userinfo
