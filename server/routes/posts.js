import {
    getPostsBySearch,
    commentPost,
    getPost,
    getPosts,
    createPost,
    updatePost,
    deletePost,
    likePost
} from '../controllers/posts.js';

import auth from '../middleware/auth.js'
import express from 'express'

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.get('/search/', getPostsBySearch);
router.patch('/:id/likePost', auth, likePost);
router.post('/:id/commentPost', auth, commentPost);

export default router;