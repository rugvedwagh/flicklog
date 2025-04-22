import { getRedis, redisAvailable } from "../config/redisClient.js";
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

    if (redisAvailable) {
        const cachedUser = await getRedis().get(cacheKey);
        if (cachedUser) {
            return res.status(200).json(JSON.parse(cachedUser));
        }
    }

    const user = await UserModel.findById(id);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    if (redisAvailable) {
        const CACHE_EXPIRY = parseInt(process.env.CACHE_EXPIRY, 10) || 300;
        const cacheSuccess = await getRedis().setex(cacheKey, CACHE_EXPIRY, JSON.stringify(user));

        if (!cacheSuccess) {
            const error = new Error("Failed to cache user data");
            error.statusCode = 500;
            throw error;
        }
    }

    const { password, refreshToken, ...filteredData } = user.toObject();

    res.status(200).json(filteredData);
};

export {
    updateUser,
    fetchUserData,
};
