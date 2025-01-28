import express from "express";
import {
    logIn,
    signUp,
    fetchUserData,
    bookmarkPost,
    updateUser,
} from "../controllers/user.controllers.js";
import verifyJWT from "../middleware/auth.middleware.js";
import asyncHandler from "../middleware/async.middleware.js";

const router = express.Router();

// Route definitions
router
    .route("/:id/update") // Corrected route for updating user details
    .patch(verifyJWT, asyncHandler(updateUser));

router
    .route("/i/:id") // Separate route for fetching user data
    .get(verifyJWT, asyncHandler(fetchUserData));

router.post("/signin", asyncHandler(logIn));

router.post("/signup", asyncHandler(signUp));

router.post("/bookmarks/add", verifyJWT, asyncHandler(bookmarkPost));

export default router;
