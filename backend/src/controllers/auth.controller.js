import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import bcrypt from 'bcrypt';

// here asyncHAndler is not used bcoz , we do not handle any web request here. it is a internal function
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});

    return {accessToken, refreshToken};
  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong while generating referesh and access token'
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const {phoneNumber, email, username, password} = req.body;

  if (
    [phoneNumber, email, username, password].some(
      (field) => field?.trim() === ''
    )
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  const existedUser = await User.findOne({
    // $or: [{phoneNumber}, {email}],
    email,
  });

  if (existedUser) {
    throw new ApiError(409, 'User already exists, please Login.');
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar file is required');
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, 'Avatar file is required 22');
  }

  const user = await User.create({
    phoneNumber,
    avatar: avatar.url, //this url comes from cloudinary
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User registered Successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const {email, password} = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'all fields are required.');
  }

  // now this 'user' also has full access of user model
  const user = await User.findOne({
    // $or: [{email}, {phoneNumber}],
    email,
  });

  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  // isPasswordCorrect is a function in user model
  // user can also access usermodel file
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid user credentials');
  }

  const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        'User logged In Successfully'
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  // these options are used to enhance security when setting cookies in web applications.
  const options = {
    httpOnly: true, //cookie cannot be accessed or modified through JavaScript on the client side
    secure: true, // cookie is only sent over secure connections (i.e., HTTPS). It prevents the cookie from being transmitted over unencrypted HTTP
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'User logged Out successfully'));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'unauthorized request');
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, 'Refresh token is expired or used');
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const {accessToken, newRefreshToken} =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {accessToken, refreshToken: newRefreshToken},
          'Access token refreshed'
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid refresh token');
  }
});

// -------------------   forgot password and reset password  ---------

const forgotPassword = async (req, res) => {
  const {email} = req.body;

  try {
    const user = await User.findOne({email});
    if (!user) return res.status(404).json({message: 'User not found'});

    const passwordResetToken = generateToken();
    user.passwordResetToken = passwordResetToken;
    user.passwordResetTokenExpires = Date.now() + 300000; // Token expires in 5 min
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${passwordResetToken}`;
    const html = `
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `;

    await sendEmail(user.email, 'Password Reset Request', html);

    res
      .status(200)
      .json({message: ' Reset Password link has been sent on email '});
  } catch (error) {
    res.status(500).json({message: 'Server error', error});
  }
};

const resetPassword = async (req, res) => {
  const {token} = req.params;
  const {password} = req.body;

  try {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: {$gt: Date.now()}, // Ensure the token is not expired
    });

    if (!user)
      return res.status(400).json({message: 'Invalid or expired token'});

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    res.status(200).json({message: 'Password reset successfully'});
  } catch (error) {
    res.status(500).json({message: 'Internal Server error', error});
  }
};

// Google OAuth callback
const googleAuthCallback = (req, res) => {
  console.log('Google Authentication Successful');

  // Access the user and tokens returned by the `done` function
  const {user, accessToken, refreshToken} = req.user;
  if (!user || !accessToken || !refreshToken) {
    console.log('user is not found in req of googleAuthCallback');
    return res.redirect('/login');
  }
  // Send the tokens to the client (e.g., via cookies or JSON response)
  const options = {
    httpOnly: true,
    // secure: true, // for production
    secure: false, // for localhost
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  console.log('cookie has set');
  res.cookie('accessToken', accessToken, options);
  res.cookie('refreshToken', refreshToken, options);

  res.redirect(`${process.env.FRONTEND_URL}/`);
};

const googleAuthenticatedUser = async (req, res) => {
  // console.log('req is: ', req);
  // const user = {};
  // const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(
  //   user._id
  // );
  // const loggedInUser = await User.findById(user._id).select(
  //   '-password -refreshToken'
  // );
  // const options = {
  //   httpOnly: true,
  //   secure: true,
  // };
  // return res
  //   .status(200)
  //   .cookie('accessToken', accessToken, options)
  //   .cookie('refreshToken', refreshToken, options)
  //   .json(
  //     new ApiResponse(
  //       200,
  //       {
  //         // user: loggedInUser,
  //         accessToken,
  //         refreshToken,
  //       },
  //       'User logged In Successfully'
  //     )
  //   );
};

export {
  generateAccessAndRefereshTokens,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  googleAuthCallback,
  googleAuthenticatedUser,
};
