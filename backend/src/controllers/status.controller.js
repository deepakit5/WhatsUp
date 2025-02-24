import asyncHandler from 'express-async-handler';
import {Status} from '../models/status.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {User} from '../models/user.model.js';

// Upload Status with Multiple Media
export const uploadStatus = async (req, res) => {
  try {
    // // console.log('----- req :', req);
    const userId = req.user._id;

    const {caption} = req.body;
    const files = req.files;

    files.map(async (file) => {
      const media = await uploadOnCloudinary(
        file.path,
        'auto', //  mediaType,
        'status-media' // folder on cloudinary
      );
      const type = file.mimetype.split('/')[0];
      await Status.create({
        senderId: userId,
        mediaUrl: media.url,
        type: type,
        caption,
      });
    });
    // );

    // const status = await Status.create({userId, mediaUrls, caption});
    res
      .status(201)
      .json({success: true, message: 'Status uploaded successfully'});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};

// Fetch my statuses
export const getMyStatuses = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const statuses = await Status.find({senderId: userId}).sort({createdAt: -1});

  res.status(200).json(statuses);
});

// // Fetch all statuses except my-status

export const getAllStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select('chatsList');
  if (!user) {
    throw new Error('User not found');
  }

  const statuses = await Status.find({
    senderId: {$ne: userId, $in: user.chatsList}, // Filter statuses
  })
    .select('_id senderId type mediaUrl caption createdAt') // Select specific fields
    .populate('senderId', 'username avatar') // Get only the username
    .sort({createdAt: -1});

  // // console.log('before map statuses: ', statuses);
  // Group statuses by senderId (user-wise)
  const userStatusMap = new Map();

  statuses.forEach((status) => {
    const senderId = status.senderId._id.toString();
    const senderName = status.senderId.username;
    const senderImg = status.senderId.avatar;

    if (!userStatusMap.has(senderId)) {
      userStatusMap.set(senderId, {
        senderId,
        senderName,
        senderImg,
        statuses: [],
        statusCount: 0,
      });
    }

    const userStatus = userStatusMap.get(senderId);
    userStatus.statuses.push({
      _id: status._id,
      type: status.type,
      mediaUrl: status.mediaUrl,

      caption: status.caption,
      createdAt: status.createdAt,
    });
    userStatus.statusCount += 1; // Increase status count
  });

  // Convert Map to an array
  const statusList = Array.from(userStatusMap.values());

  res.status(200).json(statusList);
});

// Mark status as viewed
export const markStatusAsViewed = asyncHandler(async (req, res) => {
  const {statusId} = req.body;
  const userId = req.user._id;

  const status = await Status.findById(statusId);
  if (!status) return res.status(404).json({message: 'Status not found'});

  const alreadyViewed = status.viewers.some(
    (v) => v.user.toString() === userId.toString()
  );
  if (!alreadyViewed) {
    status.viewers.push({user: userId, viewedAt: new Date()});
    await status.save();
  }

  res.json({message: 'Status marked as viewed'});
});

// Add reply to status
export const replyToStatus = asyncHandler(async (req, res) => {
  const {statusId, message} = req.body;
  const userId = req.user._id;

  const status = await Status.findById(statusId);
  if (!status) return res.status(404).json({message: 'Status not found'});

  if (status.user.toString() === userId.toString()) {
    return res
      .status(403)
      .json({message: 'You cannot reply to your own status'});
  }

  status.replies.push({user: userId, message});
  await status.save();

  res.json({
    message: 'Reply added successfully',
    reply: {user: userId, message},
  });
});
