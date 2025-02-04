import jwt from 'jsonwebtoken';

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id
        },
        process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export { generateRefreshToken };
