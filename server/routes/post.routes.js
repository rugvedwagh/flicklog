import {
    getPostsBySearch,
    commentPost,
    getPost,
    getPosts,
    createPost,
    updatePost,
    deletePost,
    likePost
} from '../controllers/post.controller.js';

import verfiyToken from '../middleware/auth.middleware.js'
import express from 'express'

const router = express.Router();


router.get('/search', getPostsBySearch);    // the position matters, if I push this line down the search does not work!

router.get('/', getPosts);

router.get('/:id', getPost);

router.post('/', verfiyToken, createPost);

router.patch('/:id', verfiyToken, updatePost);

router.delete('/:id', verfiyToken, deletePost);

router.patch('/:id/likePost', verfiyToken, likePost);

router.post('/:id/commentPost', verfiyToken, commentPost);


export default router;