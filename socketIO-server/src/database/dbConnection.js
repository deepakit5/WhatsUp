import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env", //if path is not provided ,by default it search .env file in root directory
});

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );
    console.log(
      `\n MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};
