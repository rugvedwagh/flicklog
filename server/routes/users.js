import {
    logIn,
    signUp,
    getUserData,
    bookmarkPost,
    updateUser
} from '../controllers/users.js'
import express from 'express'
import auth from '../middleware/authMiddleWare.js'
const router = express.Router()


router.post('/signin', logIn)

router.post('/signup', signUp);

router.patch('/:id/update', auth, updateUser);

router.get('/i/:id', getUserData);

router.post('/bookmarks/add', bookmarkPost);


export default router;