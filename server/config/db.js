import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://rugvedwagh02:rugved76@cluster0.dqbaczp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log(`\nMongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
