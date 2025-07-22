import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const verifyCsrfToken = async (req, res, next) => {
    const csrfToken = req.headers['x-xsrf-token'];
    const refreshToken = req.cookies?.refreshToken;

    if (!csrfToken || !refreshToken) {
        return res.status(403).json({ message: "Missing CSRF or refresh token" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId);

        if (!user || user.csrfToken !== csrfToken) {
            return res.status(403).json({ message: "Invalid CSRF token" });
        }

        req.userId = userId;
        next();
    } catch {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

export default verifyCsrfToken;
