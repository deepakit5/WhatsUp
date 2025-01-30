import express from "express";
import {
  getChatHistory,
  getChats,
  searchUser,
} from "../controllers/chat.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Route to fetch all chats for the logged-in user
router.route("/getAllChats").get(verifyJWT, getChats);

// Route to search chats for the logged-in user
router.route("/searchUser").get(verifyJWT, searchUser);

// GET /api/chats/:userId/:contactId - Get chat history between two users
router.route("/:chatId/history").get(verifyJWT, getChatHistory);

export default router;
