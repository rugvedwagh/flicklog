import {
    logIn,
    registerUser,
    refreshToken,
    getRefreshToken,
    logoutUser
} from "../controllers/auth.controller.js";
import express from 'express';
import asyncHandler from "../middleware/async.middleware.js";


const router = express.Router();

router.post("/signin", asyncHandler(logIn));

router.post("/signup", asyncHandler(registerUser));

router.get("/get-refresh-token", asyncHandler(getRefreshToken));

router.post("/refresh-token", asyncHandler(refreshToken));

router.post("/logout-user", asyncHandler(logoutUser));

export default router;