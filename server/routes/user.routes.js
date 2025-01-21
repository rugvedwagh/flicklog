import {
    logIn,
    signUp,
    getUserData,
    bookmarkPost,
    updateUser
} from '../controllers/user.controller.js'
import verfiyToken from '../middleware/auth.middleware.js'
import express from 'express'

const router = express.Router()

router.post('/signin', logIn)

router.post('/signup', signUp);

router.patch('/:id/update', auth, updateUser);

router.get('/i/:id', verfiyToken, getUserData);

router.post('/bookmarks/add', verfiyToken, bookmarkPost);


export default router;