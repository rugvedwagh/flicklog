import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            const error = new Error("Authorization header is missing.");
            error.statusCode = 401;
            return next(error); 
        }

        const token = authorizationHeader.split(" ")[1];
        const isCustomAuth = token.length < 500;

        let decodedData;

        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.userId = decodedData?.id;
        } else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }

        next(); 
    } catch (error) {
        error.statusCode = 401;
        error.message = "Token verification failed.";
        next(error); 
    }
};

export default verifyToken;
