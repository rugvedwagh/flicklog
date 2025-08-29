import { generateRefreshToken, generateAccessToken, generateCsrfToken } from "../utils/generate-tokens.js";
import createHttpError from "../utils/create-error.js";
import User from "../models/user.model.js";
import crypto from 'crypto';
import { v4 as uuidv4 } from "uuid";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

const logIn = async (req, res, next) => {
    const { email, password: plainTextPassword } = req.body;

    if (!email || !plainTextPassword) {
        return next(createHttpError("Email and password are required", 400));
    }

    if (plainTextPassword.length < 4) {
        return next(createHttpError("Password must be at least 4 characters long", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(createHttpError("User not found", 404));
    }

    const isPasswordCorrect = await bcrypt.compare(plainTextPassword, user.password);

    if (!isPasswordCorrect) {
        return next(createHttpError("Incorrect password", 400));
    }

    const sessionId = uuidv4();
    const csrfToken = generateCsrfToken(32);
    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(user);

    user.sessions.push({
        csrfToken,
        refreshToken,
        sessionId,
        userAgent: req.headers["user-agent"]
    });

    await user.save();

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const { password: _, bookmarks, __v, sessions, csrfToken: __csrf, ...result } = user.toObject();

    res.status(200).json({
        result,
        accessToken,
        csrfToken,
        sessionId
    });
};

// Register Controller
const register = async (req, res, next) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    if (!email || !password || !confirmPassword || !firstName || !lastName) {
        return next(createHttpError("All fields are required", 400));
    }

    if (password.length < 4) {
        return next(createHttpError("Password must be at least 4 characters long", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(createHttpError("Email is already in use", 400));
    }

    if (password !== confirmPassword) {
        return next(createHttpError("Passwords don't match", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
        email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
    });

    const sessionId = uuidv4();
    const csrfToken = generateCsrfToken(32);
    const refreshToken = generateRefreshToken(newUser);
    const accessToken = generateAccessToken(newUser);

    newUser.sessions.push({
        csrfToken,
        refreshToken,
        sessionId,
        userAgent: req.headers["user-agent"]
    });

    await newUser.save();

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const { password: _, bookmarks, __v, sessions, csrfToken: __csrf, ...result } = newUser.toObject();

    res.status(201).json({
        result,
        accessToken,
        csrfToken,
        sessionId
    });
};

// Logout user controller
const logoutUser = async (req, res, next) => {
    const sessionId = req.body.sessionId || req.headers['x-session-id'];

    if (!sessionId) {
        return next(createHttpError("Session ID is required", 400));
    }

    const user = await User.findOne({ "sessions.sessionId": sessionId });

    if (!user) {
        return next(createHttpError("User not found", 404));
    }

    user.sessions = user.sessions.filter(session => session.sessionId !== sessionId);
    await user.save();

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/',
    });

    return res.status(200).json({ message: "Logged out successfully" });
};

// Refresh token controller
const refreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken || typeof refreshToken !== 'string') {
        return next(createHttpError(401, 'Refresh token is missing or invalid'));
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
        return next(createHttpError(404, 'User not found'));
    }

    const session = user.sessions.find(s => s.refreshToken === refreshToken);

    if (!session) {
        return next(createHttpError(403, 'Session not found or refresh token is invalid'));
    }

    const newAccessToken = generateAccessToken(user);

    res.status(200).json({ accessToken: newAccessToken });
};

// fetch Refresh token controller
const fetchRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return next(createHttpError("Refresh token not found", 404));
    }

    res.status(200).json({ refreshToken });
};

export {
    logIn,
    register,
    refreshToken,
    fetchRefreshToken,
    logoutUser
};
