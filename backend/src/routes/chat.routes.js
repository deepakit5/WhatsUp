import express from "express";
import {
  getChatHistory,
  sendMessage,
  deleteMessage,
} from "../controllers/chatController.js";

const router = express.Router();

// GET /api/chats/:userId/:contactId - Get chat history between two users
router.route("/:userId/:contactId").get(getChatHistory);

// POST /api/chats/send - Send a new message
router.route("/send").post(sendMessage);

// DELETE /api/chats/:messageId - Delete a specific message
router.route("/:messageId").delete(deleteMessage);

export default router;
