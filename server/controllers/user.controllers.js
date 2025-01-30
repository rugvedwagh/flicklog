import { generateRefreshToken } from "../utils/generateRefreshToken.js";
import { generateToken } from "../utils/generateToken.js";
import UserModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

// Log In Controller
const logIn = async (req, res) => {
    const { email, password } = req.body;

    const oldUser = await UserModel.findOne({ email });

    if (!oldUser) {
        const error = new Error("User doesn't exist");
        error.statusCode = 404;
        throw error;
    }

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) {
        const error = new Error("Incorrect password!");
        error.statusCode = 400;
        throw error;
    }

    const token = generateToken(oldUser);
    const refreshToken = generateRefreshToken(oldUser);

    // Optionally, you can store the refresh token in the user's record
    oldUser.refreshToken = refreshToken;
    await oldUser.save();

    res.status(200).json({
        result: oldUser,
        token,
        refreshToken
    });
};

// Sign Up Controller
const signUp = async (req, res) => {
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

    const result = new UserModel({
        email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
    });

    await result.save();

    const token = generateToken(result);
    const refreshToken = generateRefreshToken(result);
    console.log(refreshToken);


    // Store the refresh token
    result.refreshToken = refreshToken;
    await result.save();

    res.status(201).json({
        result,
        token,
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
    console.log(id);

    const { name, email } = req.body;

    if (!req.userId) {
        const error = new Error("Unauthorized");
        error.statusCode = 403;
        throw error;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { name, email },
        { new: true } // Return the updated document
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

    const user = await UserModel.findById(id);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    // Manually exclude the password from the response
    const { password, ...userWithoutPassword } = user.toObject();

    res.status(200).json(userWithoutPassword);
};

const refreshToken = async (req, res) => {
    
    let { refreshToken } = req.body;
    console.log("Here in the refreshToken controller", refreshToken);

    if (!refreshToken) {
        const error = new Error("Refresh token is required");
        error.statusCode = 400;
        throw error;
    }

    // If the refreshToken is an object, convert it to a string (typically the token is in a property like 'refreshToken' in the object)
    if (typeof refreshToken !== 'string') {
        // Check if refreshToken is an object, if it is, extract the string token
        if (typeof refreshToken === 'object' && refreshToken.refreshToken) {
            refreshToken = refreshToken.refreshToken; // Extract the token from the object
        } else {
            const error = new Error("Invalid refresh token format");
            error.statusCode = 400;
            throw error;
        }
    }

    try {
        // Now that refreshToken is a string, we can proceed with verifying it
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Assuming the decoded token has a userId, you can fetch the user based on the userId in the decoded token
        const userId = decoded.id; // Replace `id` with the actual field used in the decoded token
        const user = await UserModel.findOne({ _id: userId });

        if (!user) {
            throw new Error("User not found");
        }

        // Proceed with generating a new access token
        const newToken = generateToken(user);

        // Optionally generate a new refresh token here if you're rotating it
        const newRefreshToken = generateRefreshToken(user);

        // If you're rotating the refresh token, update the user's refresh token in the database
        // Example: user.refreshToken = newRefreshToken; await user.save();

        // Send the new tokens to the client
        res.status(200).json({ token: newToken, refreshToken: newRefreshToken });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error("Refresh token has expired");
        } else {
            throw new Error("Invalid or expired refresh token");
        }
    }
};

export {
    signUp,
    logIn,
    updateUser,
    fetchUserData,
    bookmarkPost,
    refreshToken
};