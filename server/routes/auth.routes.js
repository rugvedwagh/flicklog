import express from 'express';
import {
    logIn,
    register,
    refreshToken,
    fetchRefreshToken,
    logoutUser
} from "../controllers/auth.controllers.js";

import asyncHandler from "../middleware/async.middleware.js";
import verifyCsrfToken from "../middleware/csrf.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(logIn));
router.get("/refresh-token", asyncHandler(fetchRefreshToken));

// Protected routes
router.post("/refresh-token/secure", verifyCsrfToken, asyncHandler(refreshToken));
router.post("/logout", asyncHandler(logoutUser));

export default router;
