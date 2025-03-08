// import {Server } from "socket.io";
import {Server as SocketIO} from 'socket.io';
import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './database/dbConnection.js';
import http from 'http';
import socketHandlers from './socket.handlers.js'; //
import {verifyJWT} from './middlewares/auth.middleware.js';
import {handleUserOnline} from './controllers/presence.controller.js';

dotenv.config({
  path: './.env', //if path is not provided ,by default it search .env file in root directory
});
// Express app setup
const app = express();

// HTTP server
const server = http.createServer(app);

const io = new SocketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Run the MongoDB connection function
connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`Socket.IO Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('MONGO db connection failed !!', err);
  });

// Middleware to authenticate socket connections with JWT
io.use(verifyJWT);
console.log('verification done');

// Handle incoming socket connections
io.on('connection', (socket) => {
  console.log(`--New user connected--: ${socket.id}`);

  handleUserOnline(io, socket);

  // Attach custom handlers
  socketHandlers(io, socket);
});
