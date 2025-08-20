import {
    Card,
    Button,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tooltip,
    Divider,
} from "@mui/material"
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined"
import { fetchPost, fetchPostsBySearch } from "../../redux/actions/post.actions"
import { useEffect, useState, useCallback } from "react"
import { deletePost } from "../../redux/actions/post.actions"
import { useParams, useNavigate } from "react-router-dom"
import Comments from "../../components/Comments/Comments"
import { formatPostedDate } from "../../utils/format-date"
import { useDispatch, useSelector } from "react-redux"
import { useTheme } from "../../context/themeContext"
import DeleteIcon from "@mui/icons-material/Delete"
import { Skeleton } from "@mui/material"
import { fetchUserProfile } from "../../utils/storage"
import "./postdetails.styles.css"
import PostDetailsSkeleton from "../../components/Skeletons/PostDetailsSkeleton"

const PostDetails = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const darkMode = useTheme()
    const profile = fetchUserProfile()
    const userId = profile?._id
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const { post, posts, isLoading } = useSelector((state) => state.postsReducer)

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(fetchPost(id));
    }, [id, dispatch])

    useEffect(() => {
        if (post) {
            dispatch(fetchPostsBySearch({ search: "none", tags: post?.tags.join(",") }))
        }
    }, [post, dispatch])

    const openPost = (_id) => navigate(`/posts/${_id}`)
    const handleImageClick = () => setIsFullScreen((prev) => !prev)

    const toggleDeleteDialog = useCallback(() => {
        setOpenDeleteDialog((prev) => !prev)
    }, [])

    const handleDeletePost = useCallback(() => {
        dispatch(deletePost(id))
        toggleDeleteDialog()
        navigate("/posts")
    }, [dispatch, id, toggleDeleteDialog])

    const recommendedPosts = posts.filter(({ _id }) => _id !== id)

    if (isLoading) {
        return (
            <PostDetailsSkeleton darkMode={darkMode} />
        )
    }

    if (!post) {
        return (
            <div className="error-container">
                <Typography variant="h4" className="error-text">
                    Post not found!
                </Typography>
            </div>
        )
    }

    return (
        <div className={`page-wrapper ${darkMode ? "dark" : ""}`}>
            <div className="header-section-postdetails">
                <Button className={`back-button ${darkMode ? "dark" : ""}`} onClick={() => navigate(-1)} size="small">
                    <ArrowBackOutlinedIcon />
                </Button>
            </div>

            <div className={`main-content ${darkMode ? "dark" : ""}`}>
                <div className={`hero-section ${darkMode ? "dark" : ""}`}>
                    <div className="hero-content">
                        <div className="hero-text">
                            <Typography className={`post-title ${darkMode ? "dark" : ""}`}>{post.title}</Typography>

                            <div className={`post-meta-section ${darkMode ? "dark" : ""}`}>
                                <div className="meta-left">
                                    <Typography className={`post-author ${darkMode ? "dark" : ""}`}>
                                        By <strong>{post.name}</strong>
                                    </Typography>
                                    <Typography className={`post-date ${darkMode ? "dark" : ""}`}>
                                        {formatPostedDate(post.createdAt.slice(0, 10))}
                                    </Typography>
                                </div>
                            </div>

                            <div className="tags-section">
                                {post.tags.map((tag, index) => (
                                    <span key={index} className={`tag-postdetails ${darkMode ? "dark" : ""}`}>
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className={`hero-image-container ${isFullScreen ? "fullscreen" : ""}`}>
                            <img
                                className={`hero-image ${isFullScreen ? "fullscreen" : ""}`}
                                src={post.selectedfile || "/placeholder.svg"}
                                alt={post.title}
                                onClick={handleImageClick}
                            />
                            {isFullScreen && <div className="fullscreen-overlay" onClick={handleImageClick} />}
                        </div>
                    </div>

                    {userId === post?.creator && (
                        <Tooltip title="Delete Post" arrow placement="top">
                            <Button
                                className={`delete-button-corner ${darkMode ? "dark" : ""}`}
                                onClick={toggleDeleteDialog}
                                size="small"
                            >
                                <DeleteIcon />
                            </Button>
                        </Tooltip>
                    )}

                </div>

                <div className={`content-section-postdetails ${darkMode ? "dark" : ""}`}>
                    <Typography
                        component="div"
                        className={`post-content ${darkMode ? "dark" : ""}`}
                        dangerouslySetInnerHTML={{ __html: post.message }}
                    />
                </div>

                <div className={`comments-section ${darkMode ? "dark" : ""}`}>
                    <Comments post={post} />
                </div>
            </div>

            {recommendedPosts.length > 0 && (
                <div className={`recommended-section ${darkMode ? "dark" : ""}`}>
                    <div className="recommended-header">
                        <Typography variant="h4" className={`section-title ${darkMode ? "dark" : ""}`}>
                            You might also like
                        </Typography>
                        <Divider className={`section-divider ${darkMode ? "dark" : ""}`} />
                    </div>

                    <div className="recommended-grid">
                        {recommendedPosts.slice(0, 6).map(({ title, likes, selectedfile, _id }) => (
                            <Card key={_id} className={`recommended-card ${darkMode ? "dark" : ""}`} onClick={() => openPost(_id)}>
                                <div className="card-image-container">
                                    <img src={selectedfile || "/placeholder.svg"} className="card-image" alt={title} />
                                    <div className="card-overlay">
                                        <Typography className="overlay-text">Read More</Typography>
                                    </div>
                                </div>
                                <div className="card-content">
                                    <Typography className={`card-title ${darkMode ? "dark" : ""}`}>
                                        {title.length > 60 ? title.slice(0, 60) + "..." : title}
                                    </Typography>
                                    <Typography className={`card-likes ${darkMode ? "dark" : ""}`}>
                                        {likes.length} {likes.length === 1 ? "like" : "likes"}
                                    </Typography>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {recommendedPosts.length === 0 && (
                <div className="no-recommendations">
                    <Typography variant="h5" className={`no-rec-text ${darkMode ? "dark" : ""}`}>
                        No related posts found
                    </Typography>
                </div>
            )}

            {/* Delete Dialog */}
            {userId === post?.creator && (
                <Dialog
                    open={openDeleteDialog}
                    onClose={toggleDeleteDialog}
                    aria-labelledby="delete-dialog-title"
                    aria-describedby="delete-dialog-description"
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        style: {
                            borderRadius: '20px',
                            padding: '20px',
                            backgroundColor: darkMode ? '#2a2a2a' : '#e7e9ea',
                            color: darkMode ? '#e7e9ea' : '#1a1a1a',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                            border: '1px solid #e7e9ea'
                        },
                    }}
                >
                    <DialogTitle className={darkMode ? "dark" : ""} sx={{ fontWeight: '600' }}>
                        Delete Post
                    </DialogTitle>
                    <DialogContent id="delete-dialog-content">
                        <DialogContentText id="delete-dialog-description" className={darkMode ? "dark" : ""} sx={{
                            color: darkMode ? '#e7e9ea' : '#1a1a1a'
                        }}>
                            Are you sure you want to delete this post? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={toggleDeleteDialog} variant="outlined" sx={{
                            borderRadius: '20px',
                            border: 'none',
                            color: darkMode ? '#e7e9ea' : '#1a1a1a',
                            backgroundColor: darkMode ? '#2a2a2a' : '#e7e9ea',
                            fontWeight: '600',
                            '&:hover': {
                                backgroundColor: darkMode ? '#3a3a3a' : '#f0f0f0',
                                border: 'none'
                            }
                        }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeletePost}
                            variant="outlined"
                            sx={{
                                borderRadius: '20px',
                                border: 'none',
                                color: '#e7e9ea',
                                backgroundColor: '#FF0000',
                                opacity: '0.7',
                                fontWeight: '600',
                                '&:hover': {
                                    backgroundColor: '#FF0000',
                                    border: 'none',
                                    opacity: '1'
                                }
                            }}
                        >
                            Delete
                        </Button>

                    </DialogActions>
                </Dialog>
            )}
        </div>
    )
}

export default PostDetails