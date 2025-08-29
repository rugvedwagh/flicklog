import { createPost, updatePost } from "../../redux/actions/post.actions"
import { TextField, Button, Typography, Paper, Chip, Alert } from "@mui/material"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
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
        selectedfile: null,
    });

    const [imagePreview, setImagePreview] = useState("");
    const [chipData, setChipData] = useState([]);
    const [errors, setErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const titleInputRef = useRef(null)

    useEffect(() => {
        if (post) {
            const postTags = Array.isArray(post.tags) ? post.tags : (post.tags ? post.tags.split(",").map(tag => tag.trim()) : []);
            
            setPostData({
                title: post.title || "",
                message: post.message || "",
                tags: postTags.join(","),
                selectedfile: null,
            })
            setChipData(postTags);
            setImagePreview(post.selectedfile || post.image?.url || "");
        }
    }, [post])

    useEffect(() => {
        setTimeout(() => {
            titleInputRef.current?.focus()
        }, 100)
    }, [currentId])

    // Auto-save draft
    useEffect(() => {
        const saveDraft = () => {
            if (postData.title || postData.message) {
                localStorage.setItem('postDraft', JSON.stringify(postData));
            }
        };
        
        const timer = setTimeout(saveDraft, 2000);
        return () => clearTimeout(timer);
    }, [postData]);

    // Load draft on component mount
    useEffect(() => {
        const draft = localStorage.getItem('postDraft');
        if (draft && !currentId) {
            const parsedDraft = JSON.parse(draft);
            setPostData(parsedDraft);
            setChipData(parsedDraft.tags ? parsedDraft.tags.split(',') : []);
        }
    }, [currentId]);

    // Unsaved changes warning
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges && !isUploading) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges, isUploading]);

    const validate = () => {
        const newErrors = {};
        if (!postData.title.trim()) newErrors.title = "Title is required";
        if (!postData.message.trim()) newErrors.message = "Content is required";
        if (postData.title.length > 100) newErrors.title = "Title must be under 100 characters";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const clearForm = () => {
        if (hasUnsavedChanges && !window.confirm('Are you sure you want to clear the form? All unsaved changes will be lost.')) {
            return;
        }
        
        setCurrentId(0)
        setPostData({
            title: "",
            message: "",
            tags: "",
            selectedfile: null,
        })
        setImagePreview("");
        setChipData([]);
        setErrors({});
        setShowSuccess(false);
        setHasUnsavedChanges(false);
        localStorage.removeItem('postDraft');
    }

    const toggleForm = () => {
        if (hasUnsavedChanges && !window.confirm('Are you sure you want to close? All unsaved changes will be lost.')) {
            return;
        }
        setformopen(false)
    }

    const handleInputChange = (field, value) => {
        setPostData({ ...postData, [field]: value });
        setHasUnsavedChanges(true);
        
        // Clear specific field error when user starts typing
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            
            setPostData({ ...postData, selectedfile: file });
            setHasUnsavedChanges(true);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddChip = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const value = event.target.value.trim();
            if (value && !chipData.includes(value)) {
                const newChips = [...chipData, value];
                setChipData(newChips);
                setPostData({ ...postData, tags: newChips.join(",") });
                setHasUnsavedChanges(true);
                event.target.value = '';
            }
        }
    };

    const handleDeleteChip = (chipToDelete) => {
        const newChips = chipData.filter((chip) => chip !== chipToDelete);
        setChipData(newChips);
        setPostData({ ...postData, tags: newChips.join(",") });
        setHasUnsavedChanges(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validate()) return;

        const formData = new FormData();
        formData.append('title', postData.title);
        formData.append('message', postData.message);
        formData.append('name', profile.name);
        formData.append('slug', postData.slug || generateSlug(postData.title));
        formData.append('tags', postData.tags);
        
        if (postData.selectedfile) {
            formData.append('selectedfile', postData.selectedfile);
        }

        setIsUploading(true);
        try {
            if (currentId === 0) {
                await dispatch(createPost(formData));
            } else {
                await dispatch(updatePost(currentId, formData));
            }
            
            setShowSuccess(true);
            setHasUnsavedChanges(false);
            localStorage.removeItem('postDraft');
            
            setTimeout(() => {
                toggleForm();
                clearForm();
            }, 1500);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            // You could show an error message here
        } finally {
            setIsUploading(false);
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileChange({ target: { files } });
        }
    };

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
                <div className={`form-header ${darkMode ? "dark" : ""}`}>
                    <Typography variant="h4" className={`form-title ${darkMode ? "dark" : ""}`}>
                        {currentId ? "Edit Post" : "Create New Post"}
                        {hasUnsavedChanges && <span style={{ color: '#ff9800', marginLeft: '8px' }}>*</span>}
                    </Typography>
                    <Button 
                        className={`close-button ${darkMode ? "dark" : ""}`} 
                        onClick={toggleForm} 
                        disabled={isUploading}
                    >
                        <CloseOutlinedIcon />
                    </Button>
                </div>

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
                            helperText={`${postData.title.length}/100 characters`}
                            error={!!errors.title || postData.title.length > 100}
                            onChange={(e) => {
                                const newTitle = e.target.value;
                                handleInputChange('title', newTitle);
                                setPostData({
                                    ...postData,
                                    title: newTitle,
                                    slug: generateSlug(newTitle)
                                });
                            }}
                            className={`title-input ${darkMode ? "dark" : ""}`}
                            disabled={isUploading}
                        />
                        {errors.title && (
                            <Typography color="error" variant="caption" display="block">
                                {errors.title}
                            </Typography>
                        )}
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
                                onChange={(e) => handleInputChange('message', e)}
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
                                readOnly={isUploading}
                            />
                        </div>
                        {errors.message && (
                            <Typography color="error" variant="caption" display="block">
                                {errors.message}
                            </Typography>
                        )}
                    </div>

                    {/* Tags Input */}
                    <div className="input-section">
                        <Typography variant="h6" className={`input-label ${darkMode ? "dark" : ""}`}>
                            Tags
                        </Typography>
                        <TextField
                            variant="outlined"
                            placeholder="Enter tags and press Enter"
                            fullWidth
                            onKeyDown={handleAddChip}
                            className={`tags-input ${darkMode ? "dark" : ""}`}
                            disabled={isUploading}
                        />
                        <div style={{ marginTop: '8px', minHeight: '32px' }}>
                            {chipData.map((chip) => (
                                <Chip
                                    key={chip}
                                    label={chip}
                                    onDelete={isUploading ? undefined : () => handleDeleteChip(chip)}
                                    variant="outlined"
                                    size="small"
                                    color="primary"
                                    style={{ 
                                        marginRight: '4px', 
                                        marginBottom: '4px',
                                        borderColor: darkMode ? '#64b5f6' : '#1976d2',
                                        opacity: isUploading ? 0.6 : 1
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="input-section">
                        <Typography variant="h6" className={`input-label ${darkMode ? "dark" : ""}`}>
                            Featured Image
                        </Typography>
                        <div 
                            className={`file-upload-zone ${darkMode ? "dark" : ""}`}
                            onClick={() => !isUploading && document.querySelector('input[type="file"]').click()}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            style={{
                                border: '2px dashed #ccc',
                                borderRadius: '8px',
                                padding: '20px',
                                textAlign: 'center',
                                cursor: isUploading ? 'not-allowed' : 'pointer',
                                backgroundColor: darkMode ? '#2a2a2a' : '#f9f9f9',
                                opacity: isUploading ? 0.6 : 1
                            }}
                        >
                            {imagePreview ? (
                                <div>
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        style={{ 
                                            maxWidth: '200px', 
                                            maxHeight: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }} 
                                    />
                                    <Typography variant="caption" display="block" style={{ marginTop: '8px' }}>
                                        {isUploading ? 'Uploading...' : 'Click to change image'}
                                    </Typography>
                                </div>
                            ) : (
                                <div>
                                    <CloudUploadIcon style={{ fontSize: '3rem', color: '#ccc' }} />
                                    <Typography variant="body1">
                                        Drag & drop an image here, or click to select
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        Supports: JPG, PNG, GIF (Max 5MB)
                                    </Typography>
                                </div>
                            )}
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                                style={{ display: 'none' }} 
                                disabled={isUploading}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions" style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        flexWrap: 'wrap',
                        marginTop: '24px' 
                    }}>
                        <Button 
                            variant="outlined" 
                            onClick={clearForm} 
                            className={`clear-button ${darkMode ? "dark" : ""}`} 
                            disabled={isUploading}
                            style={{ flex: '1', minWidth: '120px' }}
                        >
                            Clear Form
                        </Button>
                        <Button
                            className={`submit-button ${darkMode ? "dark" : ""}`}
                            variant="contained"
                            size="large"
                            type="submit"
                            disabled={isUploading}
                            style={{ flex: '1', minWidth: '120px' }}
                        >
                            {isUploading 
                                ? 'Publishing...' 
                                : currentId ? "Update Post" : "Publish Post"
                            }
                        </Button>
                    </div>
                </form>
            </Paper>
        </div>
    )
}

export default Form
