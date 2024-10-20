// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import {connectDB} from "./database/dbConnection.js";
import {app} from "./app.js";

// environment file configuration
// dotenv is required to load .env file and extract or parse data from .env file.
dotenv.config({
  path: "./.env", //if path is not provided ,by default it search .env file in root directory
});

// its is DB call, not DB connection. DB connection file is written in database folder
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!", err);
  });

/*
import express from "express"
const app = express()
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})()

*/
