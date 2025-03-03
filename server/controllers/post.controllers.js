import PostMessage from "../models/post.model.js";
import redis from "../config/redisClient.js";
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

    try {
        const cachedPost = await redis.get(cacheKey);
        if (cachedPost) {
            return res.status(200).json(JSON.parse(cachedPost));
        }
    } catch (err) {
        console.error(err.message);
    }

    try {
        const post = await PostMessage.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        try {
            const CACHE_EXPIRY = parseInt(process.env.CACHE_EXPIRY, 10) || 300;
            await redis.setex(cacheKey, CACHE_EXPIRY, JSON.stringify(post));
        } catch (err) {
            console.error(err.message);
        }

        res.status(200).json(post);
    } catch (err) {
        next(err);
    }
};

// Fetch All Posts
const fetchPosts = async (req, res, next) => {
    const pageNumber = parseInt(req.query.page, 10) || 1;
    const cacheKey = `posts:page:${pageNumber}`;

    try {
        const cachedPosts = await redis.get(cacheKey);
        if (cachedPosts) {
            return res.status(200).json(JSON.parse(cachedPosts));
        }
    } catch (err) {
        console.error(err.message);
    }

    try {
        const LIMIT = 6;
        const startIndex = (pageNumber - 1) * LIMIT;
        const total = await PostMessage.countDocuments({});

        const posts = await PostMessage.find()
            .sort({ _id: -1 })
            .limit(LIMIT)
            .skip(startIndex);

        const response = {
            data: posts,
            currentPage: pageNumber,
            numberOfPages: Math.ceil(total / LIMIT),
        };

        try {
            const CACHE_EXPIRY = parseInt(process.env.CACHE_EXPIRY, 10) || 300;
            await redis.setex(cacheKey, CACHE_EXPIRY, JSON.stringify(response));
        } catch (err) {
            console.log("Redis set error:", err.message);
        }

        res.status(200).json(response);
    } catch (err) {
        next(err);
    }
};

// Search Posts by Title or Tags
const fetchPostsBySearch = async (req, res, next) => {
    const { searchQuery = "", tags = "" } = req.query;
    const cacheKey = `posts:search:${searchQuery}:tags:${tags}`;

    try {
        const cachedResults = await redis.get(cacheKey);
        if (cachedResults) {
            return res.status(200).json(JSON.parse(cachedResults));
        }
    } catch (err) {
        console.error(err.message);
    }

    try {
        const title = new RegExp(searchQuery, "i");
        const tagsArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];

        const posts = await PostMessage.find({
            $or: [{ title }, { tags: { $in: tagsArray } }],
        });

        const response = { data: posts };

        try {
            const CACHE_EXPIRY = parseInt(process.env.CACHE_EXPIRY, 10) || 300;
            await redis.setex(cacheKey, CACHE_EXPIRY, JSON.stringify(response));
        } catch (err) {
            console.error(err.message);
        }

        res.status(200).json(response);
    } catch (err) {
        next(err);
    }
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

    res.status(200).json({
        message: "Post deleted successfully!",
    });
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
        post.likes.push(req.userId); // Like the post
    } else {
        post.likes = post.likes.filter((userId) => userId !== String(req.userId)); // Unlike the post
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.status(200).json(updatedPost);
};

// Add a Comment to a Post
const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

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

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.status(200).json(updatedPost);
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
};