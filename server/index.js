import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// // Middleware to set Cross-Origin-Opener-Policy header
// app.use((req, res, next) => {
//   res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
//   next();
// });

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/posts', postRoutes);
app.use('/user',userRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.DB_URL).then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port : ${PORT}`);
  });
}).catch((err) => {
  console.log(err.message);
});
