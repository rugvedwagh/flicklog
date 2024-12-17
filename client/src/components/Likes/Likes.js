import React from "react";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import './Likes.css'

const Likes = ({ likes, id }) => {
    if (likes.length > 0) {
        return likes.find((like) => like === id)
            ? (
                <>
                    <ThumbUpAltIcon fontSize="small" />
                    <span>
                        &nbsp;{`${likes.length} like${likes.length > 1 ? 's' : ''}`}
                    </span>
                </>
            ) : (
                <>
                    <ThumbUpAltOutlinedIcon fontSize="small" />
                    <span>
                        &nbsp;{likes.length} {likes.length === 1 ? 'like' : 'likes'}
                    </span>
                </>
            );
    }
    return <>
        <ThumbUpAltOutlinedIcon fontSize="small" />&nbsp;Like
    </>;
};

export default Likes;