import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import errorHandler from './middleware/error.middleware.js';
import notFound from './middleware/notFound.middleware.js'; 
import dataBaseConnection from './config/Database.js';
import redis from './config/redisClient.js'; // Import Redis client
import userRoutes from './routes/user.routes.js';   
import postRoutes from './routes/post.routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Routes
app.use('/posts', postRoutes);
app.use('/user', userRoutes);

// Global Not Found and Error Handlers
app.use(notFound);  

app.get('/', async (req, res) => {
    // Example: Store a value in Redis and retrieve it
    await redis.set("message", "Hello, Redis!");
    const redisMessage = await redis.get("message");

    res.send(`<h2>Server is running...</h2><p>Redis says: ${redisMessage}</p>`);
});

app.use(errorHandler);

const PORT = process.env.PORT || 6000;

redis.ping()
    .then(() => {
        return dataBaseConnection();  
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Server running on port:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Startup failed:", err);
    });
