import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import errorHandler from './middleware/error.middleware.js';
import notFound from './middleware/notFound.middleware.js';
import dataBaseConnection from './config/Database.js';
import { redis } from './config/redisClient.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import authRoutes from './routes/auth.routes.js';
import cookieParser from "cookie-parser"; 

dotenv.config();

const app = express();

// Middleware
app.use(
    cors({
        origin: process.env.FRONTEND_DOMAIN, 
        credentials: true, 
    })
);

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Routes
app.use('/posts', postRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes)

// Global Not Found and Error Handlers
app.use(notFound);

let redisMessage = "Redis not connected";

app.get('/', async (req, res) => {
    res.send(`<h2>Server is running...</h2>`);
});

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`\n✅ Server running on port:${PORT}`);
});

(async () => {
    try {
        await redis.ping();
    } catch (err) {
        console.error("⚠️ Redis connection failed:", err.message);
    }
})();

(async () => {
    try {
        await dataBaseConnection();
    } catch (err) {
        console.error("⚠️ MongoDB connection failed:", err.message);
    }
})();
