import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';

export const myProfile = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, 'User fetched successfully'));
});

// Get user profile info by userID
export const getUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID in the database
    const user = await User.findById(userId).select('-password'); // Exclude password for security

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Send back the user details (excluding password)
    return res
      .status(200)
      .json(new ApiResponse(200, user, 'User fetched successfully'));
  } catch (error) {
    // console.error("Error fetching user:", error);
    res.status(500).json({message: 'Server error'});
  }
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const {oldPassword, newPassword} = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, 'Invalid old password');
  }

  user.password = newPassword;
  await user.save({validateBeforeSave: false});

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password changed successfully'));
});

export const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  //  The user ID from the request parameters
  const {username, email, phoneNumber, about} = req.body; // Fields to update from the request body
  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Update the fields if provided in the request body
    if (username) user.username = username;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (about) user.about = about;

    // Save the updated user data
    const updatedUser = await user.save();

    // Return the updated user data
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          about: updatedUser.about,
        },

        'User updated successfully'
      )
    );
  } catch (error) {
    // console.error("Error updating user:", error);
    throw new ApiError(500, 'Internal Server error');
  }
});

export const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar file is missing');
  }

  //TODO: delete old image - assignment

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, 'Error while uploading avatar');
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {new: true}
  ).select('-password');

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Avatar image updated successfully'));
});
//TODO: delete old image - assignment
