import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyAccessToken = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        const error = new Error("Authorization header is missing");
        error.statusCode = 401;
        return next(error);
    }

    const accessToken = authorizationHeader.split(" ")[1];

    if (!accessToken) {
        const error = new Error("Access token is missing in Authorization header");
        error.statusCode = 401;
        return next(error);
    }

    try {
        const isCustomAuth = accessToken.length < 500;
        const decodedData = isCustomAuth
            ? jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
            : jwt.decode(accessToken);

        req.userId = decodedData?.id || decodedData?.sub;
        next();
    } catch (error) {
        error.statusCode = 401;
        error.message = "Token verification failed";
        next(error);
    }
};

export default verifyAccessToken;
