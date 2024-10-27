// This file contains the socket event handlers, keeping server.js clean and organized.

import {handleChatMessage} from "./controllers/chat.controller.js";
import {
  handleCall,
  handleCallDisconnect,
} from "./controllers/call.controller.js";
import {
  handleVideoCall,
  handleVideoCallDisconnect,
} from "./controllers/videoCall.controller.js";
import {
  handleUserOnline,
  handleUserOffline,
} from "./controllers/presence.controller.js";
import {handleNotification} from "./controllers/notification.controller.js";

const socketHandlers = (io, socket) => {
  // Handle user presence
  // console.log("first");
  socket.on("userOnline", (userId) => handleUserOnline(io, socket, userId)); //tested
  socket.on("disconnect", () => handleUserOffline(io, socket)); //tested

  // Handle notifications
  socket.on("sendNotification", (data) => handleNotification(io, socket, data));

  // Handle real-time chat messages
  socket.on("sendMessage", (data) => {
    // console.log("data: ", data);
    handleChatMessage(io, socket, data); //one to one individual converation
  });

  // Handle voice calls
  socket.on("startCall", (data) => handleCall(io, socket, data));
  socket.on("endCall", (data) => handleCallDisconnect(io, socket, data));

  // Handle video calls
  socket.on("startVideoCall", (data) => handleVideoCall(io, socket, data));
  socket.on("endVideoCall", (data) =>
    handleVideoCallDisconnect(io, socket, data)
  );
};

export default socketHandlers;
