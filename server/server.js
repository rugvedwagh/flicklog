import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import errorHandler from './middleware/error.middleware.js';
import notFound from './middleware/notFound.middleware.js';
import connectDatabase from './config/Database.js';
import { connectRedis } from './config/redisClient.js';

import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import authRoutes from './routes/auth.routes.js';

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

// Optional logging middleware for debugging (can remove in prod)
// app.use((req, res, next) => {
//     console.log(`[${req.method}] ${req.originalUrl}`);
//     next();
// });

// Routes
app.use('/posts', postRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);

// Root route
app.get('/', async (req, res) => {
    res.send(`<h3>Server is running...</h3>`);
});

// Not Found handler (if no route matched)
app.use(notFound);

// Global Error handler (always last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n✅ Server running on port: ${PORT}`);
});

connectDatabase();
connectRedis();
