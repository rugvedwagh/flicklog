import { generateRefreshToken } from "../utils/generateRefreshToken.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import UserModel from "../models/user.model.js";
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
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        result: oldUser,
        accessToken: accessToken,
        refreshToken
    });
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

    res.status(201).json({
        result: newUser,
        accessToken: accessToken,
        refreshToken
    });
};

// Logout user controller
const logoutUser = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.status(200).json({ message: 'Logged out successfully' });
    }

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });

    res.status(200).json({ message: 'Logged out successfully' });
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

    res.status(200).json({
        accessToken: newAccessToken,
    });

};

const getRefreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        const error = new Error("Refresh token not found");
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({ refreshToken });
};

export {
    logIn,
    registerUser,
    refreshToken,
    getRefreshToken,
    logoutUser
}