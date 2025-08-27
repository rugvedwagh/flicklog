import { getRedis, redisAvailable } from "../config/redis-connection.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";
import createHttpError from "../utils/create-error.js";

// Update User Controller
const updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!req.userId) {
        return next(createHttpError("Unauthorized action", 403));
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { name, email },
        { new: true }
    );

    if (!updatedUser) {
        return next(createHttpError("User not found", 404));
    }

    const updatedUserObject = updatedUser.toObject();

    delete updatedUserObject.password;
    delete updatedUserObject.sessions;
    delete updatedUserObject.csrfToken;

    res.status(200).json(updatedUserObject);
};

// Get User Data Controller
const fetchUserData = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(createHttpError("Invalid user ID", 400));
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
        return next(createHttpError("User not found", 404));
    }

    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.sessions;
    delete userObject.csrfToken;

    if (redisAvailable) {
        const CACHE_EXPIRY = parseInt(process.env.CACHE_EXPIRY, 10) || 300;
        const cacheSuccess = await getRedis().setex(cacheKey, CACHE_EXPIRY, JSON.stringify(userObject));

        if (!cacheSuccess) {
            return next(createHttpError("Failed to cache user data", 500));
        }
    }

    return res.status(200).json(userObject);
};

export {
    updateUser,
    fetchUserData,
};
