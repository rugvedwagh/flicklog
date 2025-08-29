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
import verifyAccessToken from "../middleware/auth.middleware.js";
import asyncHandler from "../middleware/async.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/search", asyncHandler(fetchPostsBySearch));

router.get("/:slugId", asyncHandler(fetchPost));

router
    .route("/")
    .get(asyncHandler(fetchPosts))
    .post(
        asyncHandler(verifyAccessToken),
        upload.single('selectedfile'),
        asyncHandler(createPost)
    );

router
    .route("/:id")
    .patch(
        asyncHandler(verifyAccessToken),
        upload.single('selectedfile'),
        asyncHandler(updatePost)
    )
    .delete(asyncHandler(verifyAccessToken), asyncHandler(deletePost));

router.patch("/:id/likePost", asyncHandler(verifyAccessToken), asyncHandler(likePost));

router.post("/:id/commentPost", asyncHandler(verifyAccessToken), asyncHandler(commentPost));

router.post("/bookmarks/add", asyncHandler(verifyAccessToken), asyncHandler(bookmarkPost));

export default router;
