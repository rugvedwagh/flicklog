import UserModel from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
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

    res.status(200).json({
        result: oldUser,
        token,
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
    res.status(201).json({ result, token });
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


export {
    signUp,
    logIn,
    updateUser,
    fetchUserData,
    bookmarkPost,
};
