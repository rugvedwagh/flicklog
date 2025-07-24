import generateRefreshToken from "../utils/generateRefreshToken.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateCsrfToken from "../utils/generateCsrfToken.js";
import createHttpError from "../utils/httpError.js";
import UserModel from "../models/user.model.js";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

// Log In Controller
const logIn = async (req, res) => {
    const { email, password } = req.body;

    const oldUser = await UserModel.findOne({ email });
    if (!oldUser) {
        createHttpError("User not found", 404);
    }

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordCorrect) {
        createHttpError("Incorrect password", 400);
    }

    const accessToken = generateAccessToken(oldUser);
    const refreshToken = generateRefreshToken(oldUser);
    const csrfToken = generateCsrfToken(32);

    oldUser.csrfToken = csrfToken;
    await oldUser.save();

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userObj = oldUser.toObject();
    const {
        password: pass,
        bookmarks,
        __v,
        updatedAt,
        refreshToken: _,
        csrfToken: _csrf,
        ...filteredUserData
    } = userObj;

    res.status(200).json({
        result: filteredUserData,
        accessToken,
        csrfToken // sent separately
    });
};

// Sign Up Controller
const register = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    const oldUser = await UserModel.findOne({ email });

    if (oldUser) {
        createHttpError("Email is already in use", 400);
    }

    if (password !== confirmPassword) {
        createHttpError("Passwords don't match", 400);
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
    const refreshToken = req.cookies.refreshToken;
    let user = null;

    if (refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const userId = decoded?.id;

            if (userId) {
                user = await UserModel.findById(userId);
                if (user) {
                    user.csrfToken = undefined;
                    await user.save();
                }
            }
        } catch (err) {
            console.log("Refresh token invalid or expired:", err.message);
        }
    }

    // Clear the cookie regardless
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

    if (!refreshToken) {
        createHttpError("Refresh token not found", 401);
    }

    if (typeof refreshToken !== "string") {
        createHttpError("Refresh token must be a valid string", 401);
    }

    const decodeToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const userId = decodeToken.id;
    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
        createHttpError("User not found", 404);
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
