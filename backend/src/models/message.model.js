// This schema represents individual messages exchanged between users.

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    tempId: {
      type: String,
    },

    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      default: null, // Set default to null instead of an empty string
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    fileInfo: {
      fileName: {type: String},
      fileSize: {type: String},
      fileType: {type: String},
      filePages: {type: Number},
    },
    type: {
      type: String,
      enum: ["text", "image", "video", "audio", "file"],
      default: "text",
    },
    status: {
      type: String,
      enum: ["pending", "saved", "delivered", "read"],
      default: "pending",
    },
    readBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    time: {
      type: String,
      default: "00:00",
      required: true,
    },
    date: {
      type: String,
      default: "",
      required: true,
    },
  },
  {timestamps: true}
);

export const Message = mongoose.model("Message", messageSchema);
