import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DatabaseConnection = async () => {
    try {
        const connection = await mongoose.connect(process.env.DB_URL);
        console.info(`✅ Connected to database at ${connection.connection.host}`);
    } catch (error) {
        console.error(`❌ Database connection error: ${error.message}`);
        process.exit(1);
    }
};

export default DatabaseConnection;
