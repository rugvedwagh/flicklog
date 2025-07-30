import generateRefreshToken from "../utils/generateRefreshToken.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateCsrfToken from "../utils/generateCsrfToken.js";
import createHttpError from "../utils/httpError.js";
import User from "../models/user.model.js";
import crypto from 'crypto';
import { v4 as uuidv4 } from "uuid";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

// Log In Controller
const logIn = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        createHttpError("Email and password are required", 400);
    }

    if( password.length < 4) {
        createHttpError("Password must be at least 4 characters long", 400);
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        createHttpError("User not found", 404);
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
        createHttpError("Incorrect password", 400);
    }

    const sessionId = uuidv4();
    const csrfToken = generateCsrfToken(32);
    const refreshToken = generateRefreshToken(existingUser);
    const accessToken = generateAccessToken(existingUser);

    existingUser.sessions.push({
        csrfToken,
        refreshToken,
        sessionId,
        userAgent: req.headers["user-agent"]
    });

    await existingUser.save();

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userObj = existingUser.toObject();
    const {
        password: pass,
        bookmarks,
        __v,
        sessions,
        csrfToken: csrf,
        ...filteredData
    } = userObj;

    res.status(200).json({
        result: filteredData,
        accessToken,
        csrfToken,
        sessionId
    });
};

// Sign Up Controller
const register = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    if(!email || !password || !confirmPassword || !firstName || !lastName) {
        createHttpError("All fields are required", 400);
    }

    if( password.length < 4) {
        createHttpError("Password must be at least 4 characters long", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        createHttpError("Email is already in use", 400);
    }

    if (password !== confirmPassword) {
        createHttpError("Passwords don't match", 400);
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

    const userObj = newUser.toObject();
    const {
        password: pass,
        bookmarks,
        __v,
        sessions,
        csrfToken: csrf,
        ...filteredData
    } = userObj;

    res.status(201).json({
        result: filteredData,
        accessToken,
        csrfToken,
        sessionId
    });
};

// Logout user controller
const logoutUser = async (req, res) => {
    const sessionId = req.body.sessionId || req.headers['x-session-id'];

    if (!sessionId) {
        createHttpError("Session ID is required", 400);
    }

    const user = await User.findOne({ "sessions.sessionId": sessionId });

    if (!user) {
        createHttpError("User not found", 404);
    }

    user.sessions = user.sessions.filter(s => s.sessionId !== sessionId);
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
const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken || typeof refreshToken !== 'string') {
        createHttpError(401, 'Refresh token is missing or invalid');
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
        createHttpError(404, 'User not found');
    }

    const session = user.sessions.find(s => s.refreshToken === refreshToken);

    if (!session) {
        createHttpError(403, 'Session not found or refresh token is invalid');
    }

    const newAccessToken = generateAccessToken(user);

    res.status(200).json({ accessToken: newAccessToken });
};

// fetch Refresh token controller
const fetchRefreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        createHttpError("Refresh token not found", 404);
    }

    res.status(200).json({ refreshToken });
};

const getCsrfToken = (req, res) => {
    const csrfToken = crypto.randomBytes(32).toString('hex');

    res.cookie('XSRF-TOKEN', csrfToken, {
        httpOnly: false,
        secure: true,
        sameSite: 'None',
        path: '/',
        maxAge: 3600000
    });

    res.status(200).json({ csrfToken });
};

export {
    logIn,
    register,
    refreshToken,
    fetchRefreshToken,
    getCsrfToken,
    logoutUser
};
