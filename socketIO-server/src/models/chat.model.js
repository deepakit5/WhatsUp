// This schema represents individual chats(conversation) between two users. Each chat contains multiple messages.

import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    // try to set max two participants
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {timestamps: true}
);

export const Chat = mongoose.model("Chat", chatSchema);
