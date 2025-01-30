// videoCallController.js
export const handleVideoCall = (io, socket, data) => {
  const {callerId, receiverId} = data;

  // Notify the receiver of an incoming video call
  io.to(receiverId).emit("incomingVideoCall", {callerId});
};

export const handleVideoCallDisconnect = (io, socket, data) => {
  const {callerId, receiverId} = data;

  // Notify both users that the video call has ended
  io.to(receiverId).emit("videoCallDisconnected", {callerId});
};
