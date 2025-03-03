import { generateRefreshToken } from "../utils/generateRefreshToken.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import UserModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import redis from "../config/redisClient.js";
import mongoose from "mongoose";

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

    res.status(201).json({
        result: newUser,
        accessToken: accessToken,
        refreshToken
    });
};

// Bookmark Post Controller
const bookmarkPost = async (req, res) => {
    const { postId, userId } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const isAlreadyBookmarked = user.bookmarks.includes(postId);

    if (isAlreadyBookmarked) {
        user.bookmarks = user.bookmarks.filter((id) => id.toString() !== postId);
        await user.save();

        res.status(200).json({
            message: "Bookmark removed successfully",
            bookmarks: user.bookmarks,
        });
    } else {
        user.bookmarks.push(postId);
        await user.save();

        res.status(200).json({
            message: "Bookmark added successfully",
            bookmarks: user.bookmarks,
        });
    }
};

// Update User Controller
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!req.userId) {
        const error = new Error("Unauthorized action");
        error.statusCode = 403;
        throw error;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { name, email },
        { new: true }
    );

    if (!updatedUser) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json(updatedUser);
};

// Get User Data Controller
const fetchUserData = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid user ID");
        error.statusCode = 400;
        throw error;
    }

    const cacheKey = `user:${id}`;

    try {
        const cachedUser = await redis.get(cacheKey);
        if (cachedUser) {
            return res.status(200).json(JSON.parse(cachedUser));
        }
    } catch (error) {
        console.log(error.message);
    }

    try {
        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        try {
            const CACHE_EXPIRY = parseInt(process.env.CACHE_EXPIRY, 10) || 300;
            await redis.setex(cacheKey, CACHE_EXPIRY, JSON.stringify(user));
        } catch (err) {
            console.log(err.message);
        }

        const { password, ...userWithoutPassword } = user.toObject();

        res.status(200).json(userWithoutPassword);

    } catch (err) {
        next(err)
    }
};

// Refresh token controller
const refreshToken = async (req, res) => {
    let { refreshToken } = req.body;

    if (!refreshToken) {
        const error = new Error("Refresh token is required");
        error.statusCode = 400;
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

    const newToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.status(200).json({
        accessToken: newToken,
        refreshToken: newRefreshToken
    });
};


export {
    registerUser,
    logIn,
    updateUser,
    fetchUserData,
    bookmarkPost,
    refreshToken
};