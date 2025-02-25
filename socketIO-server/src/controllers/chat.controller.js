// chatController.js
import {Chat} from '../models/chat.model.js';
import {Message} from '../models/message.model.js'; // Import the message model if storing chats
import {User} from '../models/user.model.js';
import {ApiError} from '../utils/ApiError.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';

// Helper functions
const getUserSocket = async (userId) => {
  try {
    // Fetch user document by userId and project only the socketId field
    const user = await User.findById(userId, {
      socketId: 1,
      undeliveredMessages: 1,
    });

    if (user) {
      return user;
    } else {
      console.log('User not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching socketId:', error);
    throw error; // Re-throw the error for higher-level handling
  }
};

export const handleChatMessage = async (io, socket, data) => {
  try {
    const {
      tempId,
      chatId,
      senderId,
      receiverId,
      content,
      fileInfo,
      caption,
      type,
      time,
      date,
    } = data;

    // save the message in the database
    const newMessage = new Message({
      tempId: tempId,
      chatId: chatId,
      senderId: senderId,
      receiverId: receiverId,
      content: content,
      fileInfo,
      caption: caption,
      status: 'saved',
      type: type,
      time: time,
      date: date,
    });
    const savedMessage = await newMessage.save();

    console.log('---- Message saved successfully ');

    // Check if a chat already exists between senderId and receiverId
    let chat = await Chat.findOne({
      members: {$all: [senderId, receiverId]}, // Match both members in any order
    });

    let lastMsgForChat = '';
    if (type === 'text') {
      lastMsgForChat = content;
    } else {
      lastMsgForChat = fileInfo.fileName;
    }

    if (chat) {
      chat.messages.unshift(savedMessage._id); // Add the new message ID at the beginning of the messages array

      chat.lastMsgInfo.msg = lastMsgForChat; // Update the last message
      chat.lastMsgInfo.time = time; // Update the last activity time
      chat.lastMsgInfo.type = type;
      const savedChat = await chat.save();
      console.log('Chat updated successfully.');
    } else {
      // Chat does not exist, create a new one
      const newChat = new Chat({
        members: [senderId, receiverId],
        messages: [savedMessage._id], // Initialize with the new message ID

        lastMsgInfo: {
          type: type,
          time: time,
          msg: lastMsgForChat,
        },
      });
      const createdChat = await newChat.save();
      createdChat.messages;
      const msg = await Message.findById(savedMessage._id);
      msg.chatId = createdChat._id;
      await msg.save();
      console.log('New chat created successfully.');

      await User.updateOne(
        {_id: senderId},
        {
          // $pull: {chatsList: createdChat._id},

          $pull: {chatsList: receiverId},
          // Remove if it exists
        }
      );

      await User.updateOne(
        {_id: senderId},
        {
          // $push: {chatsList: {$each: [createdChat._id], $position: 0}},
          $push: {chatsList: {$each: [receiverId], $position: 0}},

          //adding new user-id in sender's chatList in user schema at the beginning
        }
      );

      console.log(
        "Sender's chatsList updated with the latest chat at the beginning."
      );

      // ------------------------ receiver ----------

      // Remove the chat ID if it exists, then add it to the beginning
      await User.updateOne(
        {_id: receiverId},
        {
          // $pull: {chatsList: createdChat._id},
          $pull: {chatsList: senderId},

          // Remove if it exists
        }
      );

      await User.updateOne(
        {_id: receiverId},
        {
          // $push: {chatsList: {$each: [createdChat._id], $position: 0}},

          $push: {chatsList: {$each: [senderId], $position: 0}}, //adding new user-id in sender's chatList in user schema at the beginning
        }
      );

      console.log(
        "receiver's chatsList updated with the latest chat at the beginning."
      );
    }

    // Emit acknowledgement for the message-sender that message is received by server. (for single tick  in FE )

    // Acknowledge to the sender that the message is saved
    const msgDetails = {
      tempId: savedMessage.tempId,
      messageId: savedMessage._id,
      status: savedMessage.status,
    };
    // server tells to sender msg saved in DB
    socket.timeout(1000).emit('messageSaved', msgDetails, (response) => {
      // this callback is execute only if client side send ack.
    });

    const receiver = await getUserSocket(receiverId); // Assume a function to get receiver's socket

    // // server share new msg to the receiver and confirms receiver has got msg. then it updates msg status in DB
    if (receiver && receiver.socketId) {
      console.log('---- Receiver is online, attempting delivery.');

      io.timeout(1000)
        .to(receiver.socketId)
        .emit('receiveMessage', savedMessage, async (err, responses) => {
          if (err) {
            // some clients did not acknowledge the event in the given delay
            console.error('Message delivery failed:', err);
          } else {
            // Iterate through the responses array
            for (const response of responses) {
              const {messageId, status, chatId} = response;
              console.log('--- messageId, status:', messageId, status);
              if (messageId && status === 'received') {
                const msg = await Message.findById(messageId);
                if (msg) {
                  msg.status = 'delivered';
                  await msg.save();
                  console.log('---- message delivered');
                  addUnreadMsg(msg);
                  // Notify the sender that msg is delivered to receiver
                  socket.emit('messageDelivered', messageId);
                } else {
                  console.log(`--- No message found with ID: ${messageId}`);
                }
              } else {
                console.log('--- Required data is missing');
              }
            }
          }
        });
    } else {
      // if receiver is offline
      // Add to undelivered queue
      receiver.undeliveredMessages.push(savedMessage._id);
      await receiver.save();
      console.log('---- undeliveredMessages saved in DB: ');
    }
  } catch (error) {
    console.error('Error creating chat with message:', error);
    throw new ApiError(500, 'Internal server error');
  }
};
// ----------message is delivered but not read by receiver-----
export const addUnreadMsg = async (msg) => {
  const {_id, chatId, senderId} = msg;
  const msgId = _id;
  try {
    await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: {
          unreadMessages: {
            messageId: msgId,
            chatId: chatId,
            senderId: senderId,
          },
        },
      },
      {new: true} // To return the updated document
    );
    console.log('Unread message added successfully.');
  } catch (error) {
    console.error('Error add Unread Msg :', error);
  }
};

// --------x---remove Read Msg from unread mssg array----------

export const removeReadMsg = async (chatId, messagesToRemove) => {
  try {
    // Ensure messagesToRemove is always an array
    const messageIds = Array.isArray(messagesToRemove)
      ? messagesToRemove
      : [messagesToRemove];

    await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: {
          unreadMessages: {
            messageId: {$in: messageIds},
          },
        },
      },
      {new: true} // To return the updated document
    );
    console.log('Unread messages removed successfully.');
  } catch (error) {
    console.error('Error removing unread messages:', error);
  }
};

// ----------message read by receiver-----
export const handleMessageRead = async (io, socket, data) => {
  const {messageId, chatId, receiverId, senderId} = data;
  await removeReadMsg(chatId, messageId);

  const sender = await getUserSocket(senderId);
  try {
    console.log('--- messageId : ', messageId);
    await Message.findByIdAndUpdate(messageId, {status: 'read'});

    io.timeout(3000)
      .to(sender.socketId)
      .emit('message-read-confirmation', messageId);
  } catch (err) {
    console.error(err);
  }
};
