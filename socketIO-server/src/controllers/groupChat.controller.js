import cloudinary from "../cloudinary.js"; //check
import {Message} from "../models/message.model.js";
import {Group} from "../models/group.model.js";

// Send a text message to the group
export const sendMessage = async (socket, io, data) => {
  const {senderId, groupId, message} = data;

  try {
    const group = await Group.findById(groupId);
    if (!group) return socket.emit("error", "Group not found");

    const newMessage = new Message({
      sender: senderId,
      group: groupId,
      message,
    });

    await newMessage.save();
    io.to(groupId).emit("messageSent", newMessage); // Broadcast message to the group
  } catch (error) {
    socket.emit("error", "Error sending message");
  }
};

// Send a message with media (image, video) to the group
export const sendMediaMessage = async (socket, io, data) => {
  const {senderId, groupId, mediaFile} = data;

  try {
    const group = await Group.findById(groupId);
    if (!group) return socket.emit("error", "Group not found");

    // Upload media to Cloudinary
    const result = await cloudinary.uploader.upload(mediaFile, {
      folder: "group_media",
    });

    const newMessage = new Message({
      sender: senderId,
      group: groupId,
      mediaUrl: result.secure_url, // Cloudinary URL
    });

    await newMessage.save();
    io.to(groupId).emit("mediaMessageSent", newMessage); // Broadcast media message
  } catch (error) {
    socket.emit("error", "Error sending media message");
  }
};
