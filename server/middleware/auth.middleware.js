import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import createHttpError from '../utils/create-error.js';

dotenv.config();

const verifyAccessToken = async (req, res, next) => {
                                                                                                                                
    const auth = req.headers.authorization;
    if (!auth) {
        return next(createHttpError('Authorization header is missing', 401));
    }

    const [scheme, token] = (req.headers.authorization || '').split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
        return next(createHttpError('Invalid Authorization header format. Use: Bearer <token>', 401));
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        return next(createHttpError('Server misconfiguration: missing ACCESS_TOKEN_SECRET', 500));
    }

    let payload;
    try {
        payload = jwt.verify(token, secret);
    } catch (err) {
        return next(createHttpError('Invalid or expired access token', 401));
    }

    req.user = payload;
    req.userId = payload?.id ?? payload?.sub ?? null;

    return next();
};


export default verifyAccessToken;
