import jwt from "jsonwebtoken";
import crypto from 'crypto';

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            email: user.email,
            id: user._id,
            iat: Math.floor(Date.now() / 1000)
        },
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const generateCsrfToken = (size = 32) => {
    return crypto.randomBytes(size).toString('hex');
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            iat: Math.floor(Date.now() / 1000)
        },
        process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export {
    generateAccessToken,
    generateRefreshToken,
    generateCsrfToken
};

