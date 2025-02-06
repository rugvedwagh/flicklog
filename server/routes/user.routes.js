import express from "express";
import {
    logIn,
    signUp,
    fetchUserData,
    bookmarkPost,
    updateUser,
    refreshToken  // Import the refreshToken controller
} from "../controllers/user.controllers.js";
import verifyAccessToken from "../middleware/auth.middleware.js";
import asyncHandler from "../middleware/async.middleware.js";

const router = express.Router();

// Route definitions
router
    .route("/:id/update") 
    .patch(verifyAccessToken, asyncHandler(updateUser));

router
    .route("/i/:id") 
    .get(verifyAccessToken, asyncHandler(fetchUserData));

router.post("/signin", asyncHandler(logIn));

router.post("/signup", asyncHandler(signUp));

router.post("/bookmarks/add", verifyAccessToken, asyncHandler(bookmarkPost));

router.post("/refresh-token", asyncHandler(refreshToken));  

export default router;
