import {
    signin,
    signup,
    getUserData,
    bookmarkPost
} from '../controllers/users.js'
import express from 'express'

const router = express.Router()

router.post('/signin', signin)
router.post('/signup', signup);
router.get('/i/:id', getUserData);
router.post('/bookmarks/add', bookmarkPost);

export default router;