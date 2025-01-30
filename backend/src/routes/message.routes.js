import express from "express";
import {uploadMedia} from "../controllers/message.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js";

const router = express.Router();

router
  .route("/upload-media")
  .post(verifyJWT, upload.single("file"), uploadMedia);

export default router;
