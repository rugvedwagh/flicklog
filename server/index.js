import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/posts', postRoutes);
app.use('/user', userRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.DB_URL).then(() => {
    app.listen(PORT, () => {
        console.log(`\n\nServer listening on port : ${PORT}`);
    });
}).catch((err) => {
    console.log(err.message);
});
