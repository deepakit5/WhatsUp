import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({
  path: './.env', //if path is not provided ,by default it search .env file in root directory
});

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );
    // console.log(
    //   ` MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`
    // );
    console.log(' MongoDB connected successfully');
  } catch (error) {
    console.log('MONGODB connection FAILED ', error);
    process.exit(1);
  }
};
