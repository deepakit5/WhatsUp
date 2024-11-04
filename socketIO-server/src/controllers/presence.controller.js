// presenceController.js
import {User} from "../models/user.model.js";

export const handleUserOnline = async (io, socket) => {
  const userId = socket.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("user not found in handleUserOnline ");
    }

    if (user) {
      user.isOnline = true;
      user.socketId = socket.id;
      // socket.user.socketId = socket.id;
      await user.save();

      // Broadcast to contacts that this user is online
      io.emit("userOnline", {userId});
    }
  } catch (error) {
    console.log("error: ", error);
  }
}; //tested

export const handleUserOffline = async (io, socket) => {
  const user = await User.findOne({socketId: socket.id});

  if (user) {
    user.isOnline = false;
    user.lastSeen = new Date();
    user.socketId = null;
    await user.save();

    // Broadcast to contacts that this user is offline
    io.emit("userOffline", {userId: user._id});
  }
}; //tested
