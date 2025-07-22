import express from "express";
import {
    createPost,
    fetchPost,
    fetchPosts,
    fetchPostsBySearch,
    deletePost,
    updatePost,
    likePost,
    commentPost,
    bookmarkPost
} from "../controllers/post.controllers.js";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import asyncHandler from "../middleware/async.middleware.js";

const router = express.Router();

// Route definitions

router.get("/search", asyncHandler(fetchPostsBySearch));

router
    .route("/")
    .get(asyncHandler(fetchPosts))
    .post(verifyAccessToken, asyncHandler(createPost));

router
    .route("/:id")
    .get(asyncHandler(fetchPost))
    .patch(verifyAccessToken, asyncHandler(updatePost))
    .delete(verifyAccessToken, asyncHandler(deletePost));


router.patch("/:id/likePost", verifyAccessToken, asyncHandler(likePost));

router.post("/:id/commentPost", verifyAccessToken, asyncHandler(commentPost));

router.post("/bookmarks/add", verifyAccessToken, asyncHandler(bookmarkPost));

export default router;
