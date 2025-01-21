import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import connectDB from './config/Database.js'; // Import the database connection
import bodyParser from 'body-parser';
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
  res.send(`Server is running...`);
});

const PORT = process.env.PORT || 5000;

// Connect to the database and start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port : ${PORT}`);
  });
});
