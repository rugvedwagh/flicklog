import "./Skeletons.css"
import "../../components/Posts/posts.styles.css";
import { Grid, Skeleton } from "@mui/material";

const CardSkeleton = ({ darkMode }) => {
    return (
        <div className={`postcard ${darkMode ? "dark" : ""}`} style={{ marginTop: 18, border: '1px solid #99999948', borderRadius: 8 }}>
            <Skeleton animation="wave" variant="rounded" height={250} sx={{ borderRadius: 2, borderBottom: "1px solid #99999917" }} />
            <div className={`postcard-content ${darkMode ? "dark" : ""}`} style={{ padding: 12 }}>
                <Skeleton animation="wave" variant="text" height={28} width="70%" />
                <Skeleton animation="wave" variant="text" height={20} width="90%" />
                <Skeleton animation="wave" variant="text" height={20} width="85%" />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <Skeleton animation="wave" variant="rounded" height={24} width={72} sx={{ borderRadius: 999 }} />
                    <Skeleton animation="wave" variant="rounded" height={24} width={56} sx={{ borderRadius: 999 }} />
                    <Skeleton animation="wave" variant="rounded" height={24} width={64} sx={{ borderRadius: 999 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                    <Skeleton animation="wave" variant="circular" width={28} height={28} />
                    <Skeleton animation="wave" variant="circular" width={28} height={28} />
                    <Skeleton animation="wave" variant="circular" width={28} height={28} />
                </div>
            </div>
        </div>
    );
};

const PostsSkeleton = ({ darkMode = false, initialCount = 6 }) => {
    return (
        <div>
            <Grid className="container" container alignItems="stretch" spacing={4}>
                {Array.from({ length: initialCount }).map((_, i) => (
                    <Grid key={i} item xs={12} sm={6} lg={4}>
                        <CardSkeleton darkMode={darkMode} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default PostsSkeleton;