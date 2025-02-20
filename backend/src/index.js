import dotenv from 'dotenv';
import {connectDB} from './database/dbConnection.js';
import {app} from './app.js';

dotenv.config({
  path: './.env', //if path is not provided ,by default it search .env file in root directory
});

// its is DB call, not DB connection. DB connection file is written in database folder
const PORT = process.env.PORT || 8000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      // console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    // console.log('MONGO db connection failed !!', err);
  });
