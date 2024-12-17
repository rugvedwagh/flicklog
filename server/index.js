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

app.get('/', (req, res) => {
    res.send(`<h1>Server is running...</h1>`)
})

const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://rugvedwagh02:rugved76@cluster0.dqbaczp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => {
    app.listen(PORT, () => {
        console.log(`\n\nServer listening on port : ${PORT}`);
    });
}).catch((err) => { 
    console.log(err);
}); 