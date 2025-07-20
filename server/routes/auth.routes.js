import {
    logIn,
    registerUser,
    refreshToken,
    fetchRefreshToken,
    logoutUser
} from "../controllers/auth.controllers.js";
import express from 'express';
import asyncHandler from "../middleware/async.middleware.js";
import { verifyCsrfToken, setCsrfToken } from "../middleware/csrf.middleware.js";

const router = express.Router();

router.post("/registerUser", asyncHandler(registerUser));

router.post("/signin", setCsrfToken, asyncHandler(logIn));

router.get("/get-refresh-token", asyncHandler(fetchRefreshToken));

router.post("/refresh-token", verifyCsrfToken, asyncHandler(refreshToken));

router.post("/logout-user", verifyCsrfToken, asyncHandler(logoutUser));

export default router;