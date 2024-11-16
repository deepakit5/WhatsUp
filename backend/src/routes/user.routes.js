import express from "express";
import {
  getUser,
  changeCurrentPassword,
  updateUser,
  updateAvatar,
  // updateUserStatus,
  // getUserContacts,
  myProfile,
} from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js";

const router = express.Router();

// for self profile
router.route("/me").get(verifyJWT, myProfile); // tested

// GET /api/users/:id - Get user details by ID
router.route("/:id").get(verifyJWT, getUser); // tested

router.route("/change-password").post(verifyJWT, changeCurrentPassword); // tested
router.route("/update/me").patch(verifyJWT, updateUser); // tested

router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateAvatar); // tested

// PUT /api/users/:id/status - Update user status (online/offline, last seen)
// router.route("/:id/status").put(verifyJWT, updateUserStatus);

// GET /api/users/:id/contacts - Get user contacts by ID
// router.route("/:id/contacts").get(verifyJWT, getUserContacts);

export default router;
