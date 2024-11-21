import {Router} from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {checkFileExists} from "../middlewares/checkFileExist.middleware.js";

const router = Router();

// tested
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  checkFileExists, // Middleware to check for file presence
  registerUser
);

router.route("/login").post(loginUser); // tested

//secured routes
router.route("/logout").post(verifyJWT, logoutUser); // tested
router.route("/refresh-token").post(refreshAccessToken); // tested

router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

export default router;
