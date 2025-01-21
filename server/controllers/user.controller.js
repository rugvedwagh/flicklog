import UserModel from "../models/user.model.js";
import { generateToken } from '../utils/token.js'; 
import bcrypt from "bcrypt";

const logIn = async (req, res) => {
    
    const { email, password } = req.body;

    try {
        const oldUser = await UserModel.findOne({ email });

        if (!oldUser) return res.status(404).json({
            message: "User doesn't exist"
        });

        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

        if (!isPasswordCorrect) return res.status(400).json({
            message: "Incorrect password!"
        });

        const token = generateToken(oldUser); // Use the utility function

        res.status(200).json({ result: oldUser, token });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

const signUp = async (req, res) => {
    try {
        const { email, password, confirmPassword, firstName, lastName } = req.body;

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
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getUserData = async (req, res) => {

    const { id } = req.params;
    try {
        const user = await UserModel.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
}

const bookmarkPost = async (req, res) => {

    const { postId, userId } = req.body;

    try {
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isAlreadyBookmarked = user.bookmarks.includes(postId);

        if (isAlreadyBookmarked) {

            user.bookmarks = user.bookmarks.filter(id => id.toString() !== postId);
            await user.save();

            res.status(200).json({
                message: 'Bookmark removed successfully',
                bookmarks: user.bookmarks
            });
        } else {

            user.bookmarks.push(postId);
            await user.save();

            res.status(200).json({
                message: 'Bookmark added successfully',
                bookmarks: user.bookmarks
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Error updating bookmarks'
        });
    }
};


const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!req.userId) {
        return res.status(403).json({
            message: 'Unauthorized'
        });
    }

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { name, email },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

export {
    signUp,
    logIn,
    updateUser,
    getUserData,
    bookmarkPost
}