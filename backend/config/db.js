import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn(
      'Tip: Make sure your MongoDB service is running locally (e.g., mongod or MongoDB Compass) or update MONGO_URI in .env with your connection string.'
    );
  }
};

export const getDBStatus = () => isConnected;

export default connectDB;
