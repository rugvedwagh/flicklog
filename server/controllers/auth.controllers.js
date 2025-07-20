import { generateRefreshToken } from "../utils/generateRefreshToken.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import UserModel from "../models/user.model.js";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

// Log In Controller
const logIn = async (req, res) => {
    const { email, password } = req.body;

    const oldUser = await UserModel.findOne({ email });

    if (!oldUser) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) {
        const error = new Error("Incorrect password");
        error.statusCode = 400;
        throw error;
    }

    const accessToken = generateAccessToken(oldUser);
    const refreshToken = generateRefreshToken(oldUser);

    await oldUser.save();

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,     // Prevents JavaScript on the frontend from accessing the cookie (helps mitigate XSS)
        secure: true,       // Ensures the cookie is only sent over HTTPS (not sent over HTTP)
        sameSite: "None",   // Allows cross-site requests (required when frontend and backend are on different domains)
        path: '/',          // Cookie is valid for all routes on the domain
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userObj = oldUser.toObject();
    const { password: pass, bookmarks, __v, updatedAt, refreshToken: _, ...filteredUserData } = userObj;

    const authData = {
        result: filteredUserData,
        accessToken: accessToken
    }

    res.status(200).json(authData);
};

// Sign Up Controller
const registerUser = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    const oldUser = await UserModel.findOne({ email });

    if (oldUser) {
        const error = new Error("Email is already in use");
        error.statusCode = 400;
        throw error;
    }

    if (password !== confirmPassword) {
        const error = new Error("Passwords don't match");
        error.statusCode = 400;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new UserModel({
        email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
    });

    await newUser.save();

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

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
        refreshToken
    }

    res.status(201).json(authData);
};

// Logout user controller
const logoutUser = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(200).json({ message: "Logged out successfully" });
    }

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/',
    });

    res.clearCookie('XSRF-TOKEN', {
        httpOnly: false,
        secure: true,
        sameSite: 'None',
        path: '/'   
    });     

    const message = { message: "Logged out successfully" }

    return res.status(200).json(message);
};

// Refresh token controller
const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        const error = new Error("Refresh token not found");
        error.statusCode = 401;
        throw error;
    }

    if (typeof refreshToken !== "string") {
        const error = new Error("Refresh token must be a valid string");
        error.statusCode = 401;
        throw error;
    }

    const decodeToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const userId = decodeToken.id;
    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const newAccessToken = generateAccessToken(user);

    const accessToken = {
        accessToken: newAccessToken
    }

    res.status(200).json(accessToken);
};

// fetch Refresh token controller
const fetchRefreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        const error = new Error("Refresh token not found");
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({ refreshToken });
};

const getCsrfToken = (req, res) => {
    const csrfToken = crypto.randomBytes(32).toString('hex');

    res.cookie('XSRF-TOKEN', csrfToken, {
        httpOnly: false,     // Must be accessible by JS to send in header
        secure: true,        // HTTPS only
        sameSite: 'None',
        path: '/',
        maxAge: 3600000      // 1 hour
    });

    res.status(200).json({ csrfToken }); // optional
};

export {
    logIn,
    registerUser,
    refreshToken,
    fetchRefreshToken,
    getCsrfToken,
    logoutUser
}