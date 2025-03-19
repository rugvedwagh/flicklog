
import {redis, redisAvailable} from "../config/redisClient.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

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
        if(redisAvailable){
            const cachedUser = await redis.get(cacheKey);
            if (cachedUser) {
                return res.status(200).json(JSON.parse(cachedUser));
            }
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
            if(redisAvailable){
                const CACHE_EXPIRY = parseInt(process.env.CACHE_EXPIRY, 10) || 300;
                await redis.setex(cacheKey, CACHE_EXPIRY, JSON.stringify(user));
            }
        } catch (err) {
            console.error(err.message);
        }

        // toObject() : Converts a Mongoose document into a plain JavaScript object.
        const { password, ...userWithoutPassword } = user.toObject();

        res.status(200).json(userWithoutPassword);

    } catch (err) {
        next(err)
    }
};


export {
    updateUser,
    fetchUserData,
};