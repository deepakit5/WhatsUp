import {Chat} from '../models/chat.model.js';
import {Message} from '../models/message.model.js';
import {User} from '../models/user.model.js';

export const handleDeleteMessage = async (io, socket, data, ack) => {
  try {
    const {messageId, receiverId, chatId, content} = data;
    console.log('inside deleteMsgForEveryone event listener');
    console.log('---------msg- content: ', content);

    // Delete the message from the database
    await Message.findByIdAndDelete(messageId);
    const receiver = await User.findById(receiverId);
    await Chat.updateOne(
      {_id: chatId}, // Find the chat by ID
      {$pull: {messages: messageId}} // Remove the specific message ID from the array
    );
    console.log('---- msg deleted successfully in DB');

    // Notify the receiver to delete the message if online
    if (receiver && receiver.socketId) {
      io.timeout(3000)
        .to(receiver.socketId)
        .emit('deleteTheMessage', messageId, (err, res) => {
          if (err) {
            console.error('---- message deletion failed at receiver side ');
          } else {
            console.log('response of deleteTheMessage: ', res);
          }
        });
    } else {
      console.log('socket.id is not found:');
    }
    // Call the acknowledgment callback to notify the user
    ack({status: 'done'});
  } catch (err) {
    console.error('Error deleting message:', err);
    ack({status: 'error', message: 'Internal server error'}); // Send error acknowledgment
    throw new ApiError(500, 'Internal server error');
  }
};
