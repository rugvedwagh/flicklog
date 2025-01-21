import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const verfiyToken = async (req, res, next) => {
    try {
        //  'req.header.authorization' was set in api.js in client
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Authorization header is missing.' });
        }

        const token = authorizationHeader.split(" ")[1];
        const isCustomAuth = token.length < 500;

        let decodedData;

        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.userId = decodedData?.id;
        } else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token verification failed.' });
    }
};

export default verfiyToken;
