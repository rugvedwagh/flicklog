import React from "react";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import './Likes.css'

const Likes = ({ likes, id, darkMode }) => (
    likes.length > 0 ?
        (
            likes.includes(id) ?
                (
                    <>
                        <ThumbUpAltIcon
                            className={`like-button ${darkMode ? 'dark' : ''}`}
                            fontSize="small"
                        />

                        <span style={{ textTransform: 'none' }} className={`like-button ${darkMode ? 'dark' : ''}`}>
                            &nbsp;{likes.length > 2 ? `you and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}`}
                        </span>
                    </>
                ) : (
                    <>
                        <ThumbUpAltOutlinedIcon
                            className={`like-button ${darkMode ? 'dark' : ''}`}
                            fontSize="small"
                        />

                        <span style={{ textTransform: 'none' }} className={`like-button ${darkMode ? 'dark' : ''}`}>
                            &nbsp;{likes.length} {likes.length === 1 ? 'like' : 'likes'}
                        </span>
                    </>
                )
        ) : (
            <>
                <ThumbUpAltOutlinedIcon
                    className={`like-button ${darkMode ? 'dark' : ''}`}
                    fontSize="small"
                />
                <span className={`like-button ${darkMode ? 'dark' : ''}`}>
                    &nbsp;Like
                </span>
            </>
        )
);

export default Likes;