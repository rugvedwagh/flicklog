import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const secret = 'test';

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const oldUser = await UserModel.findOne({ email });

        if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Incorrect password!" });

        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

        res.status(200).json({ result: oldUser, token });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const signup = async (req, res) => {
    try {
        const { email, password, confirmPassword, firstName, lastName } = req.body;
        const oldUser = await UserModel.findOne({ email });

        if (oldUser) return res.status(400).json({ message: "Email is already in use" });
        if (password !== confirmPassword) return res.status(400).json({ message: "Password doesn't match" });

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = new UserModel({
            email,
            password: hashedPassword,
            name: `${firstName} ${lastName}`
        });

        await result.save();
        const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: "1h" });

        res.status(201).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
    }
};

export const getUserData = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await UserModel.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}