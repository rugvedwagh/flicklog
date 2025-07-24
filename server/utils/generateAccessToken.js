import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            email: user.email,
            id: user._id,
            iat: Math.floor(Date.now() / 1000)
        },
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
};

export default generateAccessToken;