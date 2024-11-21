import {ApiError} from "../utils/ApiError.js";

// Middleware to check for the file
export const checkFileExists = (req, res, next) => {
  const files = req.files;
  if (!files || !files.avatar || files.avatar.length === 0) {
    //    res.status(400).json({ error: "Photo is required" });
    throw new ApiError(400, "Profile Image is required");
  }
  next();
};
