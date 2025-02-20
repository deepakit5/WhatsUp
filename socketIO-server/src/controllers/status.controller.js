import {Chat} from '../models/chat.model.js';
import {Message} from '../models/message.model.js';
import {Status} from '../models/status.model.js';
import {User} from '../models/user.model.js';

export const handleStatusSeen = async (io, socket, data) => {
  // // console.log('handleStatusSeen  data: ', data);

  const {statusId, viewerId, viewerName, viewerImg} = data;

  try {
    // Create viewer object
    const newViewer = {
      viewerId,
      viewerName,
      viewerImg,
      viewedAt: new Date(), // Set the timestamp
    };

    const updatedStatus = await Status.findByIdAndUpdate(
      statusId,
      {$addToSet: {viewers: newViewer}}, // Prevent duplicates
      {new: true}
    );

    const sender = await User.findById(updatedStatus?.senderId, {
      socketId: 1,
    });

    // if user is online notify it
    if (sender?.socketId) {
      // console.log('status-seen-notify emitting...');
      io.timeout(3000)
        .to(sender.socketId)
        .emit('status-seen-notify', newViewer);
    }
  } catch (err) {
    // console.error(err);
  }
};

export const handleStatusReply = async (io, socket, data, ack) => {
  try {
    const {statusId, message, userId} = data;

    const user = await User.findById(userId, {
      socketId: 1,
    });
    const status = await Status.findById(statusId);
    if (!status) return;

    status.replies.push({user: userId, message});
    await status.save();

    if (user?.socketId) {
      io.timeout(3000)
        .to(user?.socketId)
        .emit('statusReply', {statusId, message, userId});
    }
  } catch (err) {
    // console.error('Error handle Status Reply :', err);
    throw new ApiError(500, 'Internal server error');
  }
};
