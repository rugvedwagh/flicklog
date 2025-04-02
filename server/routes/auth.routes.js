import {
    logIn,
    registerUser,
    refreshToken,
    fetchRefreshToken,
    logoutUser
} from "../controllers/auth.controller.js";
import express from 'express';
import asyncHandler from "../middleware/async.middleware.js";


const router = express.Router();

router.post("/registerUser", asyncHandler(registerUser));

router.post("/signin", asyncHandler(logIn));

router.get("/get-refresh-token", asyncHandler(fetchRefreshToken));

router.post("/refresh-token", asyncHandler(refreshToken));

router.post("/logout-user", asyncHandler(logoutUser));

export default router;