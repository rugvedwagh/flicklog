import PostMessage from "../models/postMessage.js"
import mongoose from "mongoose";

export const getPost = async (req, res) => {

}

export const getPosts = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await PostMessage.countDocuments({})

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        console.log('\nPosts loaded123!')
        console.log(Number(page), Math.ceil(total / LIMIT));
        res.status(200).json({ data: posts, currentPage: Number(page), NumberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, 'i');
        const tagsArray = tags.split(',').map(tag => tag.trim()); // Split and trim tags

        const posts = await PostMessage.find({
            $or: [
                { title },
                { tags: { $in: tagsArray } } // Use the tagsArray in $in operator
            ]
        });

        console.log(tagsArray);
        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });

    try {
        await newPost.save();
        console.log('Post Created!')
        console.log(newPost)
        res.status(201).json(newPost);

    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params  // renaming
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No posts with this id')

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true })

    console.log('\nPost updated!')

    res.json(updatedPost)
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No posts with this id')

    await PostMessage.findByIdAndDelete(id);

    console.log('\nPost deleted!')

    res.json({ message: 'Post deleted successfully!' })
}

export const likePost = async (req, res) => {

    const { id } = req.params;

    if (!req.userId) return res.json({ message: 'Unauthernticated' })
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id')

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
        post.likes.push(req.userId);
        console.log('\nPost Liked!')
    }
    else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
        console.log('\nPost UnLiked!')
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true })
    res.json(updatedPost);
}