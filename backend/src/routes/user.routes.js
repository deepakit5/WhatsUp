import express from "express";
import {
  getUser,
  updateUserStatus,
  getUserContacts,
} from "../controllers/userController.js";

const router = express.Router();

// GET /api/users/:id - Get user details by ID
router.route("/:id").get(getUser);

// PUT /api/users/:id/status - Update user status (online/offline, last seen)
router.route("/:id/status").put(updateUserStatus);

// GET /api/users/:id/contacts - Get user contacts by ID
router.route("/:id/contacts").get(getUserContacts);

export default router;
