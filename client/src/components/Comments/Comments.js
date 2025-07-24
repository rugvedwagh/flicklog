import { Typography, TextField, Button } from "@mui/material"
import { addComment } from "../../redux/actions/post.actions"
import { useTheme } from "../../context/themeContext"
import { fetchUserProfile } from "../../utils/storage"
import { useDispatch } from "react-redux"
import { useState } from "react"
import "./comments.styles.css"

const CommentsSection = ({ post }) => {
    
    const dispatch = useDispatch()
    const darkMode = useTheme()
    const profile = fetchUserProfile()
    const userId = profile._id
    const [comment, setComment] = useState("")
    const [isFocused, setIsFocused] = useState(false)
    const [comments, setComments] = useState(post?.comments)

    const postComment = async () => {
        if (!userId) return
        const finalComment = `${profile?.name}: ${comment}`
        const newComments = await dispatch(addComment(finalComment, post._id))
        setComments(newComments)
        setComment("")
        setIsFocused(false)
    }

    return (
        <div className={`comments-container ${darkMode ? "dark" : ""}`}>
            <div className={`comments-header ${darkMode ? "dark" : ""}`}>
                <Typography variant="h5" className={`comments-title ${darkMode ? "dark" : ""}`}>
                    Comments
                </Typography>
                <div className={`comments-count ${darkMode ? "dark" : ""}`}>
                    {comments?.length || 0} {comments?.length === 1 ? "comment" : "comments"}
                </div>
            </div>

            {userId && (
                <div className={`add-comment-section ${darkMode ? "dark" : ""}`}>
                    <div className={`user-avatar ${darkMode ? "dark" : ""}`}>
                        <span className="avatar-text">{profile?.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    <div className="comment-input-container">
                        <TextField
                            fullWidth
                            multiline
                            rows={isFocused ? 3 : 1}
                            variant="outlined"
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => !comment.trim() && setIsFocused(false)}
                            className={`comment-input ${darkMode ? "dark" : ""}`}
                        />
                        {isFocused && (
                            <div className="comment-actions">
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setComment("")
                                        setIsFocused(false)
                                    }}
                                    className={`cancel-btn ${darkMode ? "dark" : ""}`}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={postComment}
                                    disabled={!comment.trim()}
                                    className={`post-btn ${darkMode ? "dark" : ""}`}
                                >
                                    Post Comment
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className={`comments-list ${darkMode ? "dark" : ""}`}>
                {comments?.length > 0 ? (
                    comments
                        .slice(0)
                        .reverse()
                        .map((comment, index) => {
                            const [userName, ...commentParts] = comment.split(": ")
                            const commentText = commentParts.join(": ")

                            return (
                                <div key={index} className={`comment-item ${darkMode ? "dark" : ""}`}>
                                    <div className={`comment-avatar ${darkMode ? "dark" : ""}`}>
                                        <span className="avatar-text">{userName?.charAt(0)?.toUpperCase()}</span>
                                    </div>
                                    <div className="comment-content">
                                        <div className={`comment-author ${darkMode ? "dark" : ""}`}>{userName}</div>
                                        <div className={`comment-text ${darkMode ? "dark" : ""}`}>{commentText}</div>
                                    </div>
                                </div>
                            )
                        })
                ) : (
                    <div className={`no-comments ${darkMode ? "dark" : ""}`}>
                        <Typography variant="body1" className={`no-comments-text ${darkMode ? "dark" : ""}`}>
                            No comments yet. Be the first to share your thoughts!
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommentsSection
