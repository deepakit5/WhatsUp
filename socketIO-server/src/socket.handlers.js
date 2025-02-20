// This file contains the socket event handlers, keeping server.js clean and organized.
import {
  handleUserOnline,
  handleUserOffline,
} from './controllers/presence.controller.js';
import {
  handleChatMessage,
  handleMessageRead,
} from './controllers/chat.controller.js';

import {
  handleCall,
  handleCallDisconnect,
} from './controllers/call.controller.js';
import {
  handleVideoCall,
  handleVideoCallDisconnect,
} from './controllers/videoCall.controller.js';

import {handleNotification} from './controllers/notification.controller.js';
import {handleDeleteMessage} from './controllers/message.controller.js';
import {handleStatusSeen} from './controllers/status.controller.js';

const socketHandlers = (io, socket) => {
  // Handle user presence
  socket.on('disconnect', () => handleUserOffline(io, socket)); //tested

  // Handle real-time chat messages
  socket.on('sendMessage', (data) => {
    handleChatMessage(io, socket, data); //one to one individual converation
  });

  socket.on('message-read', (data) => {
    handleMessageRead(io, socket, data); //one to one individual converation
  });

  socket.on('deleteMsgForEveryone', (data, ack) => {
    handleDeleteMessage(io, socket, data, ack); // Pass the `ack` function //one to one individual converation
  });
  // --------------x------------  status  -------
  socket.on('status-seen', (data) => {
    handleStatusSeen(io, socket, data); //one to one individual converation
  });
  socket.on('sendReply', (data, ack) => {
    handleStatusReply(io, socket, data, ack); // Pass the `ack` function
  });

  // Handle notifications
  socket.on('sendNotification', (data) => handleNotification(io, socket, data));

  // Handle voice calls
  socket.on('startCall', (data) => handleCall(io, socket, data));
  socket.on('endCall', (data) => handleCallDisconnect(io, socket, data));

  // Handle video calls
  socket.on('startVideoCall', (data) => handleVideoCall(io, socket, data));
  socket.on('endVideoCall', (data) =>
    handleVideoCallDisconnect(io, socket, data)
  );
};

export default socketHandlers;
