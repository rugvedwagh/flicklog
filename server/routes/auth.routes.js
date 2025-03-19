import {
    logIn,
    registerUser,
    refreshToken
} from "../controllers/auth.controller.js";
import express from 'express';
import asyncHandler from "../middleware/async.middleware.js";


const router = express.Router();

router.post("/signin", asyncHandler(logIn));

router.post("/signup", asyncHandler(registerUser));

router.post("/refresh-token", asyncHandler(refreshToken));

export default router;