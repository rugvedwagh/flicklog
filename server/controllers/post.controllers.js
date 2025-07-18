import { getRedis, redisAvailable } from "../config/redisClient.js";
import PostMessage from "../models/post.model.js";
import UserModel from "../models/user.model.js";
import mongoose from 'mongoose';

// Fetch a post
const fetchPost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid post ID");
        error.statusCode = 400;
        throw error;
    }

    const cacheKey = `post:${id}`;

    if (redisAvailable) {
        const cachedPost = await getRedis().get(cacheKey);
        if (cachedPost) {
            return res.status(200).json(JSON.parse(cachedPost));
        }
    }

    const post = await PostMessage.findById(id);

    if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
    }

    if (redisAvailable) {
        const CACHE_EXPIRY = parseInt(process.env.CACHE_EXPIRY, 10) || 300;
        await getRedis().setex(cacheKey, CACHE_EXPIRY, JSON.stringify(post));
    }

    res.status(200).json(post);
};

// Fetch All Posts
const fetchPosts = async (req, res) => {
    const pageNumber = parseInt(req.query.page, 10) || 1;
    const cacheKey = `posts:page:${pageNumber}`;

    if (redisAvailable) {
        const cachedPosts = await getRedis().get(cacheKey);
        if (cachedPosts) {
            return res.status(200).json(JSON.parse(cachedPosts));
        }
    }

    const LIMIT = 6;
    const startIndex = (pageNumber - 1) * LIMIT;
    const total = await PostMessage.countDocuments({});
    const posts = await PostMessage.find()
        .sort({ _id: -1 })
        .limit(LIMIT)
        .skip(startIndex);

    if (!posts.length) {
        const error = new Error("No posts found");
        error.statusCode = 404;
        throw error;
    }

    const response = {
        data: posts,
        currentPage: pageNumber,
        numberOfPages: Math.ceil(total / LIMIT),
    };

    if (redisAvailable) {
        const CACHE_EXPIRY = parseInt(process.env.CACHE_EXPIRY, 10) || 300;
        await getRedis().setex(cacheKey, CACHE_EXPIRY, JSON.stringify(response));
    }

    res.status(200).json(response);
};

// Search Posts by Title or Tags
const fetchPostsBySearch = async (req, res) => {
    const { searchQuery = "", tags = "" } = req.query;
    const cacheKey = `posts:search:${searchQuery}:tags:${tags}`;

    if (redisAvailable) {
        const cachedResults = await getRedis().get(cacheKey);
        if (cachedResults) {
            return res.status(200).json(JSON.parse(cachedResults));
        }
    }

    const title = new RegExp(searchQuery, "i");
    const tagsArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];

    const posts = await PostMessage.find({
        $or: [{ title }, { tags: { $in: tagsArray } }],
    });

    if (!posts.length) {
        const error = new Error(`No posts found with tags: [${tagsArray.join(', ')}] or title matching: ${searchQuery}`);
        error.statusCode = 404;
        throw error;
    }

    const response = { data: posts };

    if (redisAvailable) {
        const CACHE_EXPIRY = parseInt(process.env.CACHE_EXPIRY, 10) || 300;
        await getRedis().setex(cacheKey, CACHE_EXPIRY, JSON.stringify(response));
    }

    res.status(200).json(response);
};

// Create a New Post
const createPost = async (req, res) => {
    const post = req.body;

    const newPost = new PostMessage({
        ...post,
        creator: req.userId,
        createdAt: new Date().toISOString(),
    });

    await newPost.save();
    res.status(201).json(newPost);
};

// Update a Post
const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        const error = new Error("Invalid post ID");
        error.statusCode = 400;
        throw error;
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(
        _id,
        { ...post, _id },
        { new: true }
    );

    if (!updatedPost) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
    }

    const cacheKey = `post:${_id}`;

    if (redisAvailable) {
        try {
            await getRedis().del(cacheKey);
        } catch (err) {
            console.error("⚠️ Redis delete error:", err.message);
        }
    }

    res.status(200).json(updatedPost);
};

// Delete a Post
const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid post ID");
        error.statusCode = 400;
        throw error;
    }

    const deletedPost = await PostMessage.findByIdAndDelete(id);

    if (!deletedPost) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({ message: "Post deleted successfully!" });
};

// Like or Unlike a Post
const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        const error = new Error("Unauthenticated");
        error.statusCode = 401;
        throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid post ID");
        error.statusCode = 400;
        throw error;
    }

    const post = await PostMessage.findById(id);
    if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
    }

    const index = post.likes.findIndex((userId) => userId === String(req.userId));

    if (index === -1) {
        post.likes.push(req.userId);
    } else {
        post.likes = post.likes.filter((userId) => userId !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.status(200).json(updatedPost);
};

// Add a Comment to a Post
const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    if (!value || !value.trim()) {
        const error = new Error("Comment cannot be empty");
        error.statusCode = 400;
        throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid post ID");
        error.statusCode = 400;
        throw error;
    }

    const post = await PostMessage.findById(id);
    if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
    }

    post.comments.push(value);

    const cacheKey = `post:${id}`;
    if (redisAvailable) {
        try {
            await getRedis().del(cacheKey);
        } catch (err) {
            console.error("⚠️ Redis delete error:", err.message);
        }
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.status(200).json(updatedPost);
};

// Bookmark Post Controller
const bookmarkPost = async (req, res) => {
    const { postId, userId } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const isAlreadyBookmarked = user.bookmarks.includes(postId);

    if (isAlreadyBookmarked) {
        user.bookmarks = user.bookmarks.filter((id) => id.toString() !== postId);
    } else {
        user.bookmarks.push(postId);
    }

    await user.save();

    res.status(200).json({ updatedBookmarks: user.bookmarks });
};

export {
    fetchPost,
    fetchPosts,
    fetchPostsBySearch,
    likePost,
    commentPost,
    deletePost,
    updatePost,
    createPost,
    bookmarkPost
};
