import {ApiError} from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";

export const verifyJWT = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      console.log("token is missing..");
      throw new ApiError(401, "Authentication error: No token provided");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    socket.user = decodedToken;
    // socket.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Invalid access token catch part"
    );
  }
};
