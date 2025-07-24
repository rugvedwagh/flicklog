import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyCsrfToken = async (req, res, next) => {
    const refreshToken = req.cookies?.refreshToken;
    const sessionId = req.headers['x-session-id'];
    const csrfToken = req.headers['x-xsrf-token'];

    const safePaths = ["/auth/logout"];
    if (safePaths.includes(req.path)) return next();

    if (!csrfToken || !refreshToken || !sessionId) {
        return res.status(403).json({ message: "Missing CSRF, refresh token, or session ID" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const session = user.sessions.find(
            s => s.sessionId === sessionId && s.refreshToken === refreshToken
        );

        if (!session || session.csrfToken !== csrfToken) {
            return res.status(403).json({ message: "Invalid session or CSRF token" });
        }

        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};

export default verifyCsrfToken;
