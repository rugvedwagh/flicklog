import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = async (req, res, next) => {
    try {
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
        const isCustomAuth = accessToken.length < 500;

        let decodedData;

        if (accessToken && isCustomAuth) {
            decodedData = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            req.userId = decodedData?.id;
        } else {
            decodedData = jwt.decode(accessToken);
            req.userId = decodedData?.sub;
        }

        next(); 
    } catch (error) {
        error.statusCode = 401;
        error.message = "Token verification failed";
        next(error); 
    }
};

export default verifyToken;
