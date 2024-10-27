// import {Server } from "socket.io";
import {Server as SocketIO} from "socket.io";
import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./database/dbConnection.js";

import http from "http";
import mongoose from "mongoose";
import socketHandlers from "./socket.handlers.js"; // Import socket event handlers
import {verifyJWT} from "./middlewares/auth.middleware.js";

dotenv.config({
  path: "./.env", //if path is not provided ,by default it search .env file in root directory
});
// Express app setup
const app = express();

// HTTP server
const server = http.createServer(app);

// Socket.IO setup (no need for manual SSL config)

const io = new SocketIO(server, {
  cors: {
    origin: "*", // Adjust this to your frontend's domain in production
    // origin: process.env.FRONTEND_URL,
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  },
});

// MongoDB connection
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.DB_URL);
//     console.log("MongoDB connected for Socket.IO server");
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//     process.exit(1);
//   }
// };

// Run the MongoDB connection function
connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`Socket.IO Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!", err);
  });

// Socket.IO middleware to verify JWT (if needed, optional but recommended for authentication)
// io.use((socket, next) => {
//   // const token = socket.handshake.auth.token;
//   const token = socket.handshake.headers.authorization?.split(" ")[1];

//   if (!token) {
//     console.log("token not found");
//     return next(new Error("Authentication error 1"));
//   }
//   // Implement JWT verification logic here if needed
//   // verifyJWT(socket, token);
//   console.log("jai baba ki::::::");
//   next();
// });

// io.engine.use((req, res, next) => {
//   // do something
//   // const token = socket.handshake.auth.token;
//   const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

//   if (!token) {
//     console.log("token not found");
//     return next(new Error("Authentication error 1"));
//   }
//   // Implement JWT verification logic here if needed
//   verifyJWT(socket, token);

//   next();
// });

// Use the authentication middleware

// io.use(verifyJWT);

// Middleware to authenticate socket connections with JWT
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    console.log("token missing");
    return next(new Error("Authentication error: No token provided"));
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error: Invalid token"));
    }

    socket.user = decoded; // Attach user info to the socket object
    next();
  });
});
// Handle incoming socket connections
io.on("connection", (socket) => {
  // console.log("socket: ", socket);
  console.log(`New user connected: ${socket.id}`);

  // Attach custom handlers
  socketHandlers(io, socket);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
