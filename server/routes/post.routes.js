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
} from "../controllers/post.controllers.js";
import verifyJWT from "../middleware/auth.middleware.js";
import asyncHandler from "../middleware/async.middleware.js";

const router = express.Router();

// Route definitions
router.get("/search", asyncHandler(fetchPostsBySearch));

router
    .route("/")
    .get(asyncHandler(fetchPosts))
    .post(verifyJWT, asyncHandler(createPost));

router
    .route("/:id")
    .get(asyncHandler(fetchPost))
    .patch(verifyJWT, asyncHandler(updatePost))
    .delete(verifyJWT, asyncHandler(deletePost));

router.patch("/:id/likePost", verifyJWT, asyncHandler(likePost));

router.post("/:id/commentPost", verifyJWT, asyncHandler(commentPost));

export default router;
