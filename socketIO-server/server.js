import {Server as SocketIOServer} from "socket.io";
import express from "express";
import dotenv from "dotenv";

import http from "http";
import mongoose from "mongoose";
import socketHandlers from "./socket.handlers.js"; // Import socket event handlers

// import User from '../models/userModel.js'; // For handling user status in the database

dotenv.config({
  path: "./.env", //if path is not provided ,by default it search .env file in root directory
});
// Express app setup
const app = express();

// HTTP server
const server = http.createServer(app);

// Socket.IO setup (no need for manual SSL config)
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // Adjust this to your frontend's domain in production
    // origin: process.env.FRONTEND_URL,
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  },
});

// MongoDB connection (for user status and chat management)
await mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("MongoDB connected for Socket.IO server"))
  .catch((error) =>
    console.error("MongoDB connection error in socket:", error)
  );

// Server listening
const PORT = process.env.PORT || 6000;
try {
  server.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`);
  });
} catch (err) {
  console.log("Socket.IO server error ", err);
}
// Socket.IO event handling
io.on("connection", (socket) => {
  console.log(`New socket connected: ${socket.id}`);
  socketHandlers(io, socket); // Handle all socket events in a separate file
});
