import express from "express";
import {
  startCall,
  endCall,
  getCallHistory,
} from "../controllers/call.controller.js";

const router = express.Router();

// POST /api/calls/start - Start a new call
router.route("/start").post(startCall);

// POST /api/calls/end - End an ongoing call
router.route("/end").post(endCall);

// GET /api/calls/:userId/history - Get call history for a user
router.route("/:userId/history").get(getCallHistory);

export default router;
