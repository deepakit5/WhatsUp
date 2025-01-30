// This schema represents audio or video calls between users.

import mongoose from "mongoose";

const callSchema = new mongoose.Schema({
  caller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  callType: {
    type: String,
    enum: ["audio", "video"],
    required: true,
  },
  callStatus: {
    type: String,
    enum: ["started", "ended", "missed"],
    default: "started",
  },
  callStartTime: {
    type: Date,
    default: Date.now,
  },
  callEndTime: {
    type: Date,
  },
  duration: {
    type: Number, // Duration in seconds
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Call = mongoose.model("Call", callSchema);
