import UserModel from "../models/user.model.js";
import { generateToken } from "../utils/token.js";
import bcrypt from "bcrypt";

// Log In Controller
const logIn = async (req, res) => {
    const { email, password } = req.body;

    const oldUser = await UserModel.findOne({ email });

    if (!oldUser) return res.status(404).json({
        message: "User doesn't exist"
    });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({
        message: "Incorrect password!"
    });

    const token = generateToken(oldUser);
    res.status(200).json({
        result: oldUser,
        token
    });
};

// Sign Up Controller
const signUp = async (req, res) => {
    const {
        email,
        password,
        confirmPassword,
        firstName,
        lastName
    } = req.body;

    const oldUser = await UserModel.findOne({ email });

    if (oldUser) return res.status(400).json({
        message: "Email is already in use"
    });

    if (password !== confirmPassword) return res.status(400).json({
        message: "Password doesn't match"
    });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = new UserModel({
        email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`
    });

    await result.save();

    const token = generateToken(result);
    res.status(201).json({ result, token });
};

// Bookmark Post Controller
const bookmarkPost = async (req, res) => {
    const { postId, userId } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({
        error: "User not found"
    });

    const isAlreadyBookmarked = user.bookmarks.includes(postId);

    if (isAlreadyBookmarked) {
        user.bookmarks = user.bookmarks.filter((id) => id.toString() !== postId);
        await user.save();

        res.status(200).json({
            message: "Bookmark removed successfully",
            bookmarks: user.bookmarks,
        });
    }
    else {
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

    if (!req.userId) return res.status(403).json({
        message: "Unauthorized"
    });

    const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { name, email },
        { new: true } // Return the updated document
    );

    if (!updatedUser) return res.status(404).json({
        message: "User not found"
    });

    res.status(200).json(updatedUser);
};

// Get User Data Controller
const fetchUserData = async (req, res) => {
    const { id } = req.params;

    const user = await UserModel.findById(id);

    if (!user) return res.status(404).json({
        message: "User not found"
    });

    res.status(200).json(user);
};

export {
    signUp,
    logIn,
    updateUser,
    fetchUserData,
    bookmarkPost,
};
