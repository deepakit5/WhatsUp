// notificationController.js
export const handleNotification = (io, socket, data) => {
  const {userId, notification} = data;

  // Emit notification to the user in real-time
  io.to(userId).emit("notificationReceived", notification);
};
