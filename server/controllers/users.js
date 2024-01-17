import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../models/user.js";

const secret = 'test';

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const oldUser = await UserModel.findOne({ email });

        if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

        res.status(200).json({ result: oldUser, token });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const signup = async (req, res) => {
    
    try {
        const { email, password, firstName, lastName } = req.body;
        const oldUser = await UserModel.findOne({ email });
        
        if (oldUser) return res.status(400).json({ message: "User already exists" });
        
        if (!password) {
            console.log('Im in here')
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
        console.log(email);
        console.log(token);
        res.status(201).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
    }
};