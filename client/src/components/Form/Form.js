import { createPost, updatePost } from "../../redux/actions/post.actions"
import { TextField, Button, Typography, Paper } from "@mui/material"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import { useDispatch, useSelector } from "react-redux"
import { useTheme } from "../../context/themeContext"
import { useState, useEffect, useRef } from "react"
import { fetchUserProfile } from "../../utils/storage"
import "react-quill/dist/quill.snow.css"
import FileBase from "react-file-base64"
import ReactQuill from "react-quill"
import "./form.styles.css"

const Form = ({ currentId, setCurrentId, setformopen }) => {
    const dispatch = useDispatch()
    const darkMode = useTheme()
    const profile = fetchUserProfile()
    const userId = profile._id
    const post = useSelector((state) =>
        currentId ? state.postsReducer.posts.find((message) => message._id === currentId) : null,
    )

    const [postData, setPostData] = useState({
        title: "",
        message: "",
        tags: "",
        selectedfile: "",
    })

    const titleInputRef = useRef(null)

    useEffect(() => {
        if (post) {
            setPostData({
                title: post.title || "",
                message: post.message || "",
                tags: post.tags || "",
                selectedfile: post.selectedfile || "",
            })
        }
    }, [post])

    useEffect(() => {
        setTimeout(() => {
            titleInputRef.current?.focus()
        }, 100)
    }, [currentId])

    const clearForm = () => {
        setCurrentId(0)
        setPostData({
            title: "",
            message: "",
            tags: "",
            selectedfile: "",
        })
    }

    const toggleForm = () => {
        setformopen(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        currentId === 0
            ? dispatch(createPost({ ...postData, name: profile.name }))
            : dispatch(updatePost(currentId, { ...postData, name: profile.name }))
        toggleForm()
        clearForm()
    }

    if (!userId) {
        return (
            <div className={`form-container ${darkMode ? "dark" : ""}`}>
                <Paper className={`form-paper ${darkMode ? "dark" : ""}`} elevation={0}>
                    <div className={`signin-message ${darkMode ? "dark" : ""}`}>
                        <Typography variant="h5" className={`signin-title ${darkMode ? "dark" : ""}`}>
                            Sign in to create posts
                        </Typography>
                        <Typography variant="body1" className={`signin-subtitle ${darkMode ? "dark" : ""}`}>
                            Join our community to share your thoughts and ideas
                        </Typography>
                    </div>
                </Paper>
            </div>
        )
    }

    return (
        <div className={`form-container ${darkMode ? "dark" : ""}`}>
            <Paper className={`form-paper ${darkMode ? "dark" : ""}`} elevation={0}>
                {/* Header */}
                <div className={`form-header ${darkMode ? "dark" : ""}`}>
                    <Typography variant="h4" className={`form-title ${darkMode ? "dark" : ""}`}>
                        {currentId ? "Edit Post" : "Create New Post"}
                    </Typography>
                    <Button className={`close-button ${darkMode ? "dark" : ""}`} onClick={toggleForm}>
                        <CloseOutlinedIcon />
                    </Button>
                </div>

                {/* Form */}
                <form autoComplete="off" noValidate className={`form ${darkMode ? "dark" : ""}`} onSubmit={handleSubmit}>
                    {/* Title Input */}
                    <div className="input-section">
                        <Typography variant="h6" className={`input-label ${darkMode ? "dark" : ""}`}>
                            Title
                        </Typography>
                        <TextField
                            name="title"
                            variant="outlined"
                            placeholder="Enter your post title..."
                            fullWidth
                            inputRef={titleInputRef}
                            value={postData.title}
                            onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                            className={`title-input ${darkMode ? "dark" : ""}`}
                        />
                    </div>

                    {/* Content Editor */}
                    <div className="input-section">
                        <Typography variant="h6" className={`input-label ${darkMode ? "dark" : ""}`}>
                            Content
                        </Typography>
                        <div className={`editor-container ${darkMode ? "dark" : ""}`}>
                            <ReactQuill
                                name="message"
                                value={postData.message}
                                onChange={(e) => setPostData({ ...postData, message: e })}
                                className={`content-editor ${darkMode ? "dark" : ""}`}
                                modules={{
                                    toolbar: [
                                        [{ header: [1, 2, false] }],
                                        ["bold", "italic", "underline", "strike", "blockquote"],
                                        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                                        ["link", "image"],
                                        ["clean"],
                                    ],
                                }}
                                formats={[
                                    "header",
                                    "bold",
                                    "italic",
                                    "underline",
                                    "strike",
                                    "blockquote",
                                    "list",
                                    "bullet",
                                    "indent",
                                    "link",
                                    "image",
                                ]}
                                placeholder="Write your post content here..."
                            />
                        </div>
                    </div>

                    {/* Tags Input */}
                    <div className="input-section">
                        <Typography variant="h6" className={`input-label ${darkMode ? "dark" : ""}`}>
                            Tags
                        </Typography>
                        <TextField
                            name="tags"
                            variant="outlined"
                            placeholder="Enter tags separated by commas (e.g., technology, coding, tips)"
                            fullWidth
                            value={postData.tags}
                            onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(",") })}
                            className={`tags-input ${darkMode ? "dark" : ""}`}
                        />
                    </div>

                    {/* File Upload */}
                    <div className="input-section">
                        <Typography variant="h6" className={`input-label ${darkMode ? "dark" : ""}`}>
                            Featured Image
                        </Typography>
                        <div className={`file-upload-container ${darkMode ? "dark" : ""}`}>
                            <FileBase
                                type="file"
                                multiple={false}
                                onDone={({ base64 }) => setPostData({ ...postData, selectedfile: base64 })}
                            />
                            {postData.selectedfile && (
                                <div className="image-preview">
                                    <img src={postData.selectedfile || "/placeholder.svg"} alt="Preview" className="preview-image" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions">
                        <Button variant="outlined" onClick={clearForm} className={`clear-button ${darkMode ? "dark" : ""}`}>
                            Clear Form
                        </Button>
                        <Button
                            className={`submit-button ${darkMode ? "dark" : ""}`}
                            variant="contained"
                            size="large"
                            type="submit"
                        >
                            {currentId ? "Update Post" : "Publish Post"}
                        </Button>
                    </div>
                </form>
            </Paper>
        </div>
    )
}

export default Form
