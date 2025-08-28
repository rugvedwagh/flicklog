import { createPost, updatePost } from "../../redux/actions/post.actions"
import { TextField, Button, Typography, Paper } from "@mui/material"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import { useDispatch, useSelector } from "react-redux"
import { useTheme } from "../../context/themeContext"
import { useState, useEffect, useRef } from "react"
import { fetchUserProfile } from "../../utils/storage"
import { generateSlug } from "../../utils/create-slug"
import "react-quill/dist/quill.snow.css"
import ReactQuill from "react-quill"
import "./form.styles.css"

const Form = ({ currentId, setCurrentId, setformopen }) => {
    const dispatch = useDispatch()
    const darkMode = useTheme()
    const profile = fetchUserProfile()
    const userId = profile?._id
    const post = useSelector((state) =>
        currentId ? state.postsReducer.posts.find((message) => message._id === currentId) : null,
    )

    const [postData, setPostData] = useState({
        title: "",
        slug: "",
        message: "",
        tags: "",
        selectedfile: null, // Changed to store File object
    });

    const [imagePreview, setImagePreview] = useState(""); 
    const titleInputRef = useRef(null)

    useEffect(() => {
        if (post) {
            setPostData({
                title: post.title || "",
                message: post.message || "",
                tags: Array.isArray(post.tags) ? post.tags.join(", ") : (post.tags || ""),
                selectedfile: null, 
            })
            setImagePreview(post.selectedfile || post.image?.url || "");
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
            selectedfile: null,
        })
        setImagePreview("");
    }

    const toggleForm = () => {
        setformopen(false)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPostData({ ...postData, selectedfile: file });
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault()

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('title', postData.title);
        formData.append('message', postData.message);
        formData.append('name', profile.name);
        formData.append('slug', postData.slug || generateSlug(postData.title));
        formData.append('tags', postData.tags);
        
        if (postData.selectedfile) {
            formData.append('selectedfile', postData.selectedfile);
        }

        currentId === 0
            ? dispatch(createPost(formData)) // Pass FormData instead of object
            : dispatch(updatePost(currentId, formData))
        
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
                            onChange={(e) => {
                                const newTitle = e.target.value;
                                setPostData({
                                    ...postData,
                                    title: newTitle,
                                    slug: generateSlug(newTitle)
                                });
                            }}
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
                            onChange={(e) => setPostData({ ...postData, tags: e.target.value })}
                            className={`tags-input ${darkMode ? "dark" : ""}`}
                        />
                    </div>

                    {/* File Upload - REPLACED FileBase with standard input */}
                    <div className="input-section">
                        <Typography variant="h6" className={`input-label ${darkMode ? "dark" : ""}`}>
                            Featured Image
                        </Typography>
                        <div className={`file-upload-container ${darkMode ? "dark" : ""}`}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px dashed #ccc',
                                    borderRadius: '8px',
                                    backgroundColor: darkMode ? '#2a2a2a' : '#f5f5f5',
                                    cursor: 'pointer'
                                }}
                            />
                            {imagePreview && (
                                <div className="image-preview" style={{ marginTop: '16px' }}>
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="preview-image"
                                        style={{
                                            maxWidth: '200px',
                                            maxHeight: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
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
