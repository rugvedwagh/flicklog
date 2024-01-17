import jwt from "jsonwebtoken";

const secret = 'test';

const auth = async (req, res, next) => {
    try {
        
        const authorizationHeader = req.headers.authorization;
        
        if (!authorizationHeader) {
            // Handle the case where authorization header is missing
            return res.status(401).json({ message: 'Authorization header is missing.' });
        }

        const token = authorizationHeader.split(" ")[1];
        const isCustomAuth = token.length < 500;

        let decodedData;

        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, secret);
            req.userId = decodedData?.id;
        } else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Token verification failed.' });
    }
};

export default auth;
