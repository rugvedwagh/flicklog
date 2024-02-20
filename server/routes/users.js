import {
    signin,
    signup,
    getUserData
} from '../controllers/users.js'
import express from 'express'

const router = express.Router()

router.post('/signin', signin)
router.post('/signup', signup);
router.get('/info/:id', getUserData);

export default router;