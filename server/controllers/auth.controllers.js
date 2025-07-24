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

    const oldUser = await User.findOne({ email });
    if (!oldUser) {
        createHttpError("User not found", 404);
    }

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordCorrect) {
        createHttpError("Incorrect password", 400);
    }

    const sessionId = uuidv4();
    const csrfToken = generateCsrfToken(32);
    const refreshToken = generateRefreshToken(oldUser);
    const accessToken = generateAccessToken(oldUser);

    oldUser.sessions.push({
        csrfToken,
        refreshToken,
        sessionId,
        userAgent: req.headers["user-agent"]
    });

    await oldUser.save();

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userObj = oldUser.toObject();
    const {
        password: pass,
        bookmarks,
        __v,
        sessions,
        ...filteredUserData
    } = userObj;

    res.status(200).json({
        result: filteredUserData,
        accessToken,
        csrfToken,
        sessionId
    });
};

// Sign Up Controller
const register = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    const oldUser = await User.findOne({ email });

    if (oldUser) {
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

    await newUser.save();

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    const csrfToken = generateCsrfToken(32);

    newUser.csrfToken = csrfToken;
    await newUser.save();

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const authData = {
        result: newUser,
        accessToken: accessToken,
        refreshToken,
        csrfToken
    }

    res.status(201).json(authData);
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
