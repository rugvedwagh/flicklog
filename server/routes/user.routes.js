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
    .route("/i/:id")
    .get(verifyJWT, asyncHandler(fetchUserData))
    .patch(verifyJWT, asyncHandler(updateUser));

router.post("/signin", asyncHandler(logIn));

router.post("/signup", asyncHandler(signUp));

router.post("/bookmarks/add", verifyJWT, asyncHandler(bookmarkPost));

export default router;
