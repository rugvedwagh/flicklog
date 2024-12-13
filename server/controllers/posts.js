import PostMessage from "../models/postMessage.js"
import mongoose from "mongoose";

export const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
}

export const getPosts = async (req, res) => {
    const { page } = req.query;

    try {
        const LIMIT = 6;
        const startIndex = (Number(page) - 1) * LIMIT; // Calculate the starting index for the query
        const total = await PostMessage.countDocuments({}); // Total number of documents in the collection

        const posts = await PostMessage.find()
            .sort({ _id: -1 }) // Sort by newest posts first
            .limit(LIMIT)
            .skip(startIndex);

        res.status(200).json({
            data: posts,
            currentPage: Number(page),
            numberOfPages: Math.ceil(total / LIMIT), // Corrected key name for consistency
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};


export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, 'i');
        const tagsArray = tags.split(',').map(tag => tag.trim()); // Split and trim tags

        const posts = await PostMessage.find({
            $or: [
                {
                    title
                },
                {
                    tags:
                    {
                        $in: tagsArray
                    }
                } 
            ]
        });

        res.json({
            data: posts
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage({
        ...post,
        creator: req.userId,
        createdAt: new Date().toISOString()
    });

    try {
        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        res.status(409).json({
            message: error.message
        })
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    try {
        // Check if the provided ID is valid
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).send('No post with this id');
        }

        // Attempt to update the post
        const updatedPost = await PostMessage.findByIdAndUpdate(
            _id, { ...post, _id }, { new: true }
        );

        // If no post is found, respond with a 404 error
        if (!updatedPost) {
            return res.status(404).send('No post found');
        }

        // Respond with the updated post
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        });
    }
};

export const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send('No post with this id');
        }

        await PostMessage.findByIdAndDelete(id);

        res.json({
            message: 'Post deleted successfully!'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        });
    }
};

export const likePost = async (req, res) => {
    const { id } = req.params;

    try {
        if (!req.userId) {
            return res.status(401).json({
                message: 'Unauthenticated'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send('No post with this id');
        }

        const post = await PostMessage.findById(id);

        if (!post) {
            return res.status(404).send('No post found');
        }

        const index = post.likes.findIndex((id) => id === String(req.userId));

        if (index === -1) {
            post.likes.push(req.userId);
        } else {
            post.likes = post.likes.filter((id) => id !== String(req.userId));
        }

        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        });
    }
};

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send('No post with this id');
        }

        const post = await PostMessage.findById(id);

        if (!post) {
            return res.status(404).send('No post found');
        }

        post.comments.push(value);

        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong. Please try again later.'
        });
    }
};
