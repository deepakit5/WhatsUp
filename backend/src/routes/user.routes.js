import express from "express";
import {
  getUser,
  // updateUserStatus,
  // getUserContacts,
  myProfile,
} from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = express.Router();

// for self profile
router.route("/me").get(verifyJWT, myProfile);

// GET /api/users/:id - Get user details by ID
router.route("/:id").get(verifyJWT, getUser);

// PUT /api/users/:id/status - Update user status (online/offline, last seen)
// router.route("/:id/status").put(verifyJWT, updateUserStatus);

// GET /api/users/:id/contacts - Get user contacts by ID
// router.route("/:id/contacts").get(verifyJWT, getUserContacts);

export default router;
