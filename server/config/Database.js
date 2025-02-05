import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dataBaseConnection = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL);
        console.log(`\nDataBase connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default dataBaseConnection;
