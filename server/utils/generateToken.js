import jwt from "jsonwebtoken";

const generateToken = (user) => {
    return jwt.sign(
        {
            email: user.email,
            id: user._id
        },
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1hr' });
};

export {generateToken}