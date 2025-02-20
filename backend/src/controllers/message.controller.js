import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';

export const uploadMedia = asyncHandler(async (req, res) => {
  const mediaLocalPath = req.file?.path;
  if (!mediaLocalPath) {
    throw new ApiError(400, 'Avatar file is missing');
  }

  const fileType = req.file?.mimetype;

  let mediaType = '';
  let folder = '';
  if (fileType.startsWith('image/')) {
    mediaType = 'image';
    folder = 'chat-images';
  } else if (fileType.startsWith('video/')) {
    mediaType = 'video';
    folder = 'chat-videos';
  } else if (fileType.startsWith('audio/')) {
    mediaType = 'raw';
    folder = 'chat-audios';
  } else if (
    fileType.startsWith('application/') ||
    fileType.startsWith('text/')
  ) {
    mediaType = 'raw';
    folder = 'chat-files';
  } else {
    throw new ApiError(400, 'Invalid media file type');
  }

  //TODO: delete old image/media - assignment

  const media = await uploadOnCloudinary(mediaLocalPath, mediaType, folder);
  if (!media.url) {
    throw new ApiError(400, 'Error while uploading media');
  }

  return res.json(
    new ApiResponse(200, media.url, 'media  uploaded successfully')
  );
});

//TODO: delete old image/ media - assignment
