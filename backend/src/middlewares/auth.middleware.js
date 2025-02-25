import {ApiError} from '../utils/ApiError.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import {User} from '../models/user.model.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.cookies?.token ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      // return next(new ApiError(401, 'Token is missing'));
      console.log('--- Token is missing in auth-middleware');
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      '-password -refreshToken'
    );

    if (!user) {
      // next(new ApiError(401, 'Invalid token!'));
      console.log('--- Invalid token! in auth middleware ');
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }

    req.user = user;
    next();
  } catch (error) {
    // return next(new ApiError(401, error?.message || 'Invalid access token'));
    console.log('--- Token is missing in auth-middleware');

    return res.redirect(`${process.env.FRONTEND_URL}/login`);
  }
});
