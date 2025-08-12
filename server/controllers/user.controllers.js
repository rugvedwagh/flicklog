import { getRedis, redisAvailable } from "../config/redisClient.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";
import createHttpError from "../utils/httpError.js";

// Update User Controller
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!req.userId) {
        createHttpError("Unauthorized action", 403);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { name, email },
        { new: true }
    );

    if (!updatedUser) {
        createHttpError("User not found", 404);
    }

    const updatedUserObject = updatedUser.toObject();

    delete updatedUserObject.password;
    delete updatedUserObject.sessions;
    delete updatedUserObject.csrfToken;

    res.status(200).json(updatedUserObject);
};

// Get User Data Controller
const fetchUserData = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        createHttpError("Invalid user ID", 400);
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
        createHttpError("User not found", 404);
    }

    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.sessions;
    delete userObject.csrfToken;

    if (redisAvailable) {
        const CACHE_EXPIRY = parseInt(process.env.CACHE_EXPIRY, 10) || 300;
        const cacheSuccess = await getRedis().setex(cacheKey, CACHE_EXPIRY, JSON.stringify(user));

        if (!cacheSuccess) {
            createHttpError("Failed to cache user data", 500);
        }
    }

    return res.status(200).json(userObject);
};

export {
    updateUser,
    fetchUserData,
};
