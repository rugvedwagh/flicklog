import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import https from 'https';

import errorHandler from './middleware/error.middleware.js';
import notFound from './middleware/notFound.middleware.js';
import connectDatabase from './config/Database.js';
import { connectRedis } from './config/redisClient.js';

import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();

app.set('trust proxy', 1); // Trust first proxy (Render)

// Middleware
app.use(
    cors({
        origin: process.env.FRONTEND_DOMAIN,
        credentials: true,
    })
);

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

// Routes
app.use('/posts', postRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);

// Root
app.get('/', (req, res) => {
    res.send(`<h3>✅ Server is running in ${process.env.NODE_ENV || 'development'} mode</h3>`);
});

// Not Found
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Connect to DB & Redis
connectDatabase();
connectRedis();

// Server logic
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'development') {
    const sslOptions = {
        key: fs.readFileSync('./certs/key.pem'),
        cert: fs.readFileSync('./certs/cert.pem'),
    };

    https.createServer(sslOptions, app).listen(443, () => {
        console.log(`\n✅ HTTPS Dev Server running at https://localhost`);
    });

} else {
    app.listen(PORT, () => {
        console.log(`\n🚀 Production server running on port ${PORT}`);
    });
}
