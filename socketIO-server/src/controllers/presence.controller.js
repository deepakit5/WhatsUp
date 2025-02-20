// presenceController.js
import {Message} from "../models/message.model.js";
import {User} from "../models/user.model.js";

export const handleUserOnline = async (io, socket) => {
  const userId = socket.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      // console.log("user not found in handleUserOnline ");
    } else {
      user.isOnline = true;
      user.socketId = socket.id;
      await user.save();

      // Broadcast to contacts that this user is online
      io.emit("userOnline", {userId});

      let usera = await user.populate("undeliveredMessages");

      if (usera && usera.undeliveredMessages.length > 0) {
        usera.undeliveredMessages.forEach((message) => {
          io.timeout(1000)
            .to(socket.id)
            .emit("receiveMessage", message, async (err, responses) => {
              if (err) {
                // console.log(err);
              }
              // console.log("---- ack  in presence controller: ", responses);

              for (const response of responses) {
                const {messageId, status, chatId} = response;
                // // console.log("--- messageId, status:", messageId, status);
                if (messageId && status === "received") {
                  const msg = await Message.findById(messageId);
                  if (msg) {
                    msg.status = "delivered";
                    await msg.save();

                    // console.log(
                      `--- msg status aved in db in presence controller: `
                    );

                    // Notify the sender
                    socket.emit("messageDelivered", messageId);
                  } else {
                    // console.log(`--- No message found with ID: ${messageId}`);
                  }
                } else {
                  // console.log("--- Required data is missing");
                }
              }
            });
        });
        // Clear undelivered messages
        usera.undeliveredMessages = [];
        await usera.save();
      }
    }
  } catch (error) {
    // console.log("error: ", error);
  }
}; //tested

export const handleUserOffline = async (io, socket) => {
  // console.log("------inside handle User Offline ");
  const user = await User.findOne({socketId: socket.id});

  if (user) {
    user.isOnline = false;
    user.lastSeen = new Date();
    user.socketId = "######abc";
    await user.save();

    // Broadcast to contacts that this user is offline
    io.emit("userOffline", {userId: user._id});
  }
}; //tested
