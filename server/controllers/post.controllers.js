import { getRedis, redisAvailable } from "../config/redis.js";
import PostMessage from "../models/post.model.js";
import UserModel from "../models/user.model.js";
import mongoose from 'mongoose';
import createHttpError from "../utils/create-error.js";
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

// Fetch a post
const fetchPost = async (req, res, next) => {
    const { slugId } = req.params;

    const [slug, id] = slugId.split(/-(?=[^ -]+$)/);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(createHttpError("Invalid post ID", 400));
    }

    const cacheKey = `post:${slug}-${id}`;

    if (redisAvailable) {
        const cachedPost = await getRedis().get(cacheKey);
        if (cachedPost) {
            return res.status(200).json(JSON.parse(cachedPost));
        }
    }

    const post = await PostMessage.findById(id);

    if (!post) {
        return next(createHttpError("Post not found", 404));
    }

    if (redisAvailable) {
        const CACHE_EXPIRY = parseInt(process.env.CACHE_EXPIRY, 10) || 300;
        await getRedis().setex(cacheKey, CACHE_EXPIRY, JSON.stringify(post));
    }

    res.status(200).json(post);
};

// Fetch All Posts
const fetchPosts = async (req, res, next) => {
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
        return next(createHttpError("No posts found", 404));
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
const fetchPostsBySearch = async (req, res, next) => {
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
        return next(createHttpError(
            `No posts found with tags): [${tagsArray.join(', ')}] or title matching: ${searchQuery}`,
            404
        ));
    }

    const response = { data: posts };

    if (redisAvailable) {
        const CACHE_EXPIRY = parseInt(process.env.CACHE_EXPIRY, 10) || 300;
        await getRedis().setex(cacheKey, CACHE_EXPIRY, JSON.stringify(response));
    }

    res.status(200).json(response);
};

// Create a New Post
const createPost = async (req, res, next) => {
    const { title, message, name, tags, slug } = req.body;
    let imageData = {};

    if (req.file) {
        console.log('Uploading file to Cloudinary:', req.file.originalname);

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'posts',
            resource_type: 'image',
            transformation: [
                { width: 1000, height: 1000, crop: 'limit' },
                { quality: 'auto:good' }
            ]
        });

        imageData = {
            url: result.secure_url,
            publicId: result.public_id,
            originalName: req.file.originalname
        };

        fs.unlinkSync(req.file.path);
    }

    const newPost = new PostMessage({
        title,
        message,
        name,
        creator: req.userId,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        slug,
        selectedfile: imageData.url || '',
        image: imageData,
        createdAt: new Date().toISOString(),
    });

    const savedPost = await newPost.save();

    if (redisAvailable) {
        const cachePattern = 'posts:*';
        const redis = getRedis();
        const keys = await redis.keys(cachePattern);
        if (keys.length > 0) {
            await redis.del(keys);
        }
    }

    res.status(201).json(savedPost);
};


// Update a Post
const updatePost = async (req, res, next) => {
    const { id: _id } = req.params;
    const { title, message, tags, slug } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return next(createHttpError("Invalid post ID", 400));
    }

    let updateData = { title, message, tags, slug, _id };

    if (req.file) {
        const existingPost = await PostMessage.findById(_id);

        if (existingPost && existingPost.image?.publicId) {
            await cloudinary.uploader.destroy(existingPost.image.publicId);
            console.log('Old image deleted from Cloudinary:', existingPost.image.publicId);
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'posts',
            resource_type: 'image',
            transformation: [
                { width: 1000, height: 1000, crop: 'limit' },
                { quality: 'auto:good' }
            ]
        });

        updateData.image = {
            url: result.secure_url,
            publicId: result.public_id,
            originalName: req.file.originalname
        };
        updateData.selectedfile = result.secure_url;

        fs.unlinkSync(req.file.path);
        console.log('New image uploaded successfully:', result.secure_url);
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, updateData, { new: true });

    if (!updatedPost) {
        return next(createHttpError("Post not found", 404));
    }

    const cacheKey = `post:${_id}`;
    if (redisAvailable) {
        const redis = getRedis();
        await redis.del(cacheKey);

        const cachePattern = 'posts:*';
        const keys = await redis.keys(cachePattern);
        if (keys.length > 0) {
            await redis.del(keys);
        }
    }

    res.status(200).json(updatedPost);
};


// Delete a Post
const deletePost = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(createHttpError("Invalid post ID", 400));
    }

    const post = await PostMessage.findById(id);

    if (!post) {
        return next(createHttpError("Post not found", 404));
    }

    // Delete image from Cloudinary if exists
    if (post.image?.publicId) {
        await cloudinary.uploader.destroy(post.image.publicId);
        console.log('Image deleted from Cloudinary:', post.image.publicId);
    }

    const deletedPost = await PostMessage.findByIdAndDelete(id);

    // Clear caches
    const cacheKey = `post:${id}`;
    if (redisAvailable) {
        const redis = getRedis();
        await redis.del(cacheKey);

        // Clear posts list caches too
        const cachePattern = 'posts:*';
        const keys = await redis.keys(cachePattern);
        if (keys.length > 0) {
            await redis.del(keys);
        }
    }

    res.status(200).json({ message: "Post deleted successfully!" });
};


// Like or Unlike a Post
const likePost = async (req, res, next) => {
    const { id } = req.params;

    if (!req.userId) {
        return next(createHttpError("Unauthenticated", 401));
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(createHttpError("Invalid post ID", 400));
    }

    const post = await PostMessage.findById(id);
    if (!post) {
        return next(createHttpError("Post not found", 404));
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
const commentPost = async (req, res, next) => {
    const { id } = req.params;
    const { value } = req.body;

    if (!value || !value.trim()) {
        return next(createHttpError("Comment cannot be empty", 400));
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(createHttpError("Invalid post ID", 400));
    }

    const post = await PostMessage.findById(id);
    if (!post) {
        return next(createHttpError("Post not found", 404));
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
const bookmarkPost = async (req, res, next) => {
    const { postId, userId } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) {
        return next(createHttpError("User not found", 404));
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
