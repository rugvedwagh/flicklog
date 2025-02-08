import errorHandler from './middleware/error.middleware.js';
import notFound from './middleware/notFound.middleware.js'; 
import dataBaseConnection from './config/Database.js';
import userRoutes from './routes/user.routes.js';   
import postRoutes from './routes/post.routes.js';
import bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

// Middleware
app.use(cors());

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Routes
app.use('/posts', postRoutes);
app.use('/user', userRoutes);

// Global Not Found and Error Handlers (ensure notFound is used before errorHandler)
app.use(notFound);  

app.get('/', (req, res) => {
    res.send(`<h2>Server is running...</h2>`);
});

app.use(errorHandler);  

const PORT = process.env.PORT || 6000;  

dataBaseConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server  on port: ${PORT}`);
    });
});
