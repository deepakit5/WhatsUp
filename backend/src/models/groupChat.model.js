// This schema represents group chats, which contain multiple participants and messages.

import mongoose from "mongoose";

const groupChatSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
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
    groupAdmins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    groupPic: {
      type: String,
      default: "", // URL of group profile picture
    },
  },
  {timestamps: true}
);

export const GroupChat = mongoose.model("GroupChat", groupChatSchema);
