// This schema represents individual chats(conversation) between two users. Each chat contains multiple messages.

import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    // try to set max two members
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      ref: "User", // Array of user IDs
      validate: {
        validator: function (value) {
          // Ensure that the number of members does not exceed 2
          return value.length <= 2;
        },
        message: "A chat can only have a maximum of 2 members.",
      },
    },
    chatAvatar: {
      type: String, // cloudinary url
      default: "", // URL of profile picture
    },
    messages: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Message",
    },
    unreadMessages: [
      {
        messageId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Message",
          required: true,
        },
        chatId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Chat",
          required: true,
        },
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],

    lastMsgInfo: {
      type: {
        type: String,
        default: "text",
      },
      time: {
        type: String,
        default: "00:00",
      },
      msg: {
        type: String,
        default: "last message demo",
      },
    },
  },
  {timestamps: true}
);

export const Chat = mongoose.model("Chat", chatSchema);
