import { Skeleton, Card, Divider } from "@mui/material"
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined"
import "./Skeletons.css"

const PostDetailsSkeleton = ({ darkMode }) => {
    return (
        <div className={`page-wrapper ${darkMode ? "dark" : ""}`}>
            {/* Header */}
            <div className="header-section-postdetails">
                <Skeleton variant="circular" width={32} height={32} animation="wave">
                    <ArrowBackOutlinedIcon />
                </Skeleton>
            </div>

            {/* Main content */}
            <div className={`main-content ${darkMode ? "dark" : ""}`}>
                <div className={`hero-section ${darkMode ? "dark" : ""}`}>
                    <div className="hero-content">
                        <div className="hero-text">
                            <Skeleton width="70%" height={40} animation="wave" />
                            <div className={`post-meta-section ${darkMode ? "dark" : ""}`}>
                                <div className="meta-left">
                                    <Skeleton width={120} height={20} animation="wave" />
                                    <Skeleton width={80} height={20} animation="wave" />
                                </div>
                            </div>
                            <div className="tags-section">
                                <Skeleton variant="rectangular" width={60} height={24} animation="wave" />
                                <Skeleton variant="rectangular" width={60} height={24} animation="wave" style={{ marginLeft: 8 }} />
                            </div>
                        </div>

                        <div className="hero-image-container">
                            <Skeleton
                                variant="rectangular"
                                width="100%"
                                height={350}
                                animation="wave"
                                className="hero-image"
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className={`content-section-postdetails ${darkMode ? "dark" : ""}`}>
                    <Skeleton width="100%" height={20} animation="wave" />
                    <Skeleton width="90%" height={20} animation="wave" />
                    <Skeleton width="95%" height={20} animation="wave" />
                </div>

                {/* Comments */}
                <div className={`comments-section ${darkMode ? "dark" : ""}`}>
                    <Skeleton width="40%" height={30} animation="wave" />
                    <Skeleton width="100%" height={60} animation="wave" />
                    <Skeleton width="80%" height={60} animation="wave" />
                </div>
            </div>

            {/* Recommended Posts */}
            <div className={`recommended-section ${darkMode ? "dark" : ""}`}>
                <div className="recommended-header">
                    <Skeleton width="30%" height={30} animation="wave" />
                    <Divider className={`section-divider ${darkMode ? "dark" : ""}`} />
                </div>
                <div className="recommended-grid">
                    {Array.from(new Array(3)).map((_, index) => (
                        <Card key={index} className={`recommended-card ${darkMode ? "dark" : ""}`}>
                            <Skeleton variant="rectangular" width="100%" height={150} animation="wave" />
                            <div className="card-content">
                                <Skeleton width="80%" height={25} animation="wave" />
                                <Skeleton width="40%" height={20} animation="wave" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PostDetailsSkeleton
