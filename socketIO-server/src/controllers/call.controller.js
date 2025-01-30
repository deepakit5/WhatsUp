// callController.js
export const handleCall = (io, socket, data) => {
  const {callerId, receiverId} = data;

  // Notify the receiver of an incoming voice call
  io.to(receiverId).emit("incomingCall", {callerId, callType: "voice"});
};

export const handleCallDisconnect = (io, socket, data) => {
  const {callerId, receiverId} = data;

  // Notify both users that the call has ended
  io.to(receiverId).emit("callDisconnected", {callerId});
};
