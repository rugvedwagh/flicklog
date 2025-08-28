import React from "react"
import { Skeleton, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined"
import "./Skeletons.css"

const UserInfoSkeleton = ({ darkMode }) => {
  return (
    <div className={`page-container ${darkMode ? "dark" : ""}`}>
      <div className="header-section">
        <ArrowBackOutlinedIcon className={`back-button-userinfo ${darkMode ? "dark" : ""}`} />
      </div>

      <div className={`profile-container ${darkMode ? "dark" : ""}`}>
        {/* Profile Header Card */}
        <div className={`profile-header-card ${darkMode ? "dark" : ""}`}>
          <div className={`avatar-large ${darkMode ? "dark" : ""}`}>
            {/* circular avatar skeleton animation="wave" */}
            <Skeleton animation="wave" variant="circular" width={80} height={80} />
          </div>

          {/* username */}
          <h2 className={`username-large ${darkMode ? "dark" : ""}`}>
            <Skeleton animation="wave" variant="text" width={200} height={32} />
          </h2>

          {/* email */}
          <p className={`user-email ${darkMode ? "dark" : ""}`}>
            <Skeleton animation="wave" variant="text" width={260} height={22} />
          </p>
          <p className={`user-email ${darkMode ? "dark" : ""}`}>
            <Skeleton animation="wave" variant="text" width={260} height={22} />
          </p>

        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className={`stat-card ${darkMode ? "dark" : ""}`}>
            <div className={`stat-number ${darkMode ? "dark" : ""}`}>
              <Skeleton animation="wave" variant="text" width={40} height={28} />
            </div>
            <div className={`stat-label ${darkMode ? "dark" : ""}`}>
              <Skeleton animation="wave" variant="text" width={100} height={18} />
            </div>
          </div>

          <div className={`stat-card ${darkMode ? "dark" : ""}`}>
            <div className={`stat-number ${darkMode ? "dark" : ""}`}>
              <Skeleton animation="wave" variant="text" width={40} height={28} />
            </div>
            <div className={`stat-label ${darkMode ? "dark" : ""}`}>
              <Skeleton animation="wave" variant="text" width={100} height={18} />
            </div>
          </div>

          <div className={`stat-card ${darkMode ? "dark" : ""}`}>
            <div className={`stat-number ${darkMode ? "dark" : ""}`}>
              <Skeleton animation="wave" variant="text" width={40} height={28} />
            </div>
            <div className={`stat-label ${darkMode ? "dark" : ""}`}>
              <Skeleton animation="wave" variant="text" width={70} height={18} />
            </div>
          </div>
        </div>

        {/* Account Info Card */}
        <div className={`info-card ${darkMode ? "dark" : ""}`}>
          <h3 className={`card-title ${darkMode ? "dark" : ""}`}>
            <Skeleton animation="wave" variant="text" width={200} height={26} />
          </h3>
          <div className="info-row">
            <span className={`info-label ${darkMode ? "dark" : ""}`}>
              <Skeleton animation="wave" variant="text" width={120} height={18} />
            </span>
            <span className={`info-value ${darkMode ? "dark" : ""}`}>
              <Skeleton animation="wave" variant="text" width={160} height={18} />
            </span>
          </div>
        </div>

        {/* Bookmarks Section */}
        <div className={`bookmarks-card ${darkMode ? "dark" : ""}`}>
          <div className="bookmarks-header">
            <h3 className={`card-title ${darkMode ? "dark" : ""}`}>
              <Skeleton animation="wave" variant="text" width={180} height={24} />
            </h3>
            <Button variant="text" className={`toggle-btn ${darkMode ? "dark" : ""}`} disabled>
              <Skeleton animation="wave" variant="text" width={90} height={22} />
            </Button>
          </div>

          {/* Bookmarks list (render a few rows to preserve height) */}
          <div className="bookmarks-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`bookmark-item ${darkMode ? "dark" : ""}`}>
                <div className="bookmark-content">
                  <h4 className={`bookmark-title ${darkMode ? "dark" : ""}`}>
                    <Skeleton animation="wave" variant="text" width={260} height={20} />
                  </h4>
                </div>
                {/* remove icon placeholder */}
                <Skeleton animation="wave" variant="circular" width={24} height={24} className="remove-bookmark-btn" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Dialog skeleton animation="wave" (only show if you want to preserve layout when opening) */}
      {/* Optional: wrap with a prop to toggle */}
      <Dialog
        open={false}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: "20px",
            padding: "20px",
            backgroundColor: darkMode ? "#1e1e1e" : "#fefefe",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            color: darkMode ? "#fff" : "#333",
          }}
        >
          <Skeleton animation="wave" variant="text" width={160} height={28} />
        </DialogTitle>

        <DialogContent>
          <Skeleton animation="wave" variant="rounded" height={56} sx={{ borderRadius: 2, mb: 2 }} />
          <Skeleton animation="wave" variant="rounded" height={56} sx={{ borderRadius: 2 }} />
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", marginTop: 1 }}>
          <Skeleton animation="wave" variant="rounded" width={100} height={36} sx={{ borderRadius: 1 }} />
          <Skeleton animation="wave" variant="rounded" width={140} height={36} sx={{ borderRadius: 1 }} />
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default UserInfoSkeleton;
