import {Chat} from '../models/chat.model.js';
import {Message} from '../models/message.model.js';
import {User} from '../models/user.model.js';

// Get all existing chats (optional: filter by user)5
export const getChats = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming authentication middleware sets the logged-in user

    const chats = await Chat.find(
      {members: userId},
      {members: 1, lastMsgInfo: 1, unreadMessages: 1}
    );

    // Check if userId matches any user's chatsList
    const users = await User.find(
      {chatsList: userId}, // this chat list actuall contains user id not chat id
      {username: 1, _id: 1, about: 1, phoneNumber: 1, avatar: 1, isOnline: 1}
    );

    // Fetch chats by user

    // an array for combining elements of chats and users arrays by verifying so that correct combinations will takes placed

    const combinedList = chats
      .map((chat) => {
        const matchedUser = users.find((user) =>
          chat.members.includes(user._id.toString())
        );
        if (matchedUser) {
          return {
            chat,
            user: matchedUser,
          };
        }
        return null;
      })
      .filter((item) => item !== null);

    res.status(200).json(combinedList);
  } catch (error) {
    res.status(500).json({message: 'Failed to fetch chats', error});
  }
};

// for finding new chats
export const searchUser = async (req, res) => {
  const userId = req.user?._id;
  const {query} = req.query; // query: input text, userId: current user's ID

  try {
    let result = [];

    if (!query) {
      console.log('no query::::');
      return res.json(result); // Empty array if no query
    }

    // Check if query is a phone number (only digits)
    const isNumber = /^\d+$/.test(query);
    if (isNumber) {
      // Search for phone number in entire user collection
      result = await User.find(
        {phoneNumber: query},
        {username: 1, about: 1, phoneNumber: 1, avatar: 1} // Select required fields
      );
    } else {
      // Search in the user's chatList array
      const currentUser = await User.findById(userId).populate(
        'chatsList',
        'username phoneNumber profileImage'
      );

      if (currentUser && currentUser.chatsList) {
        result = currentUser.chatsList.filter((chat) =>
          chat.username.toLowerCase().includes(query.toLowerCase())
        );
      }
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Server Error'});
  }
};

// Function to get chat history
export const getChatHistory = async (req, res) => {
  try {
    const {chatId} = req.params; // Extract chatId from request parameters

    if (!chatId) {
      return res.status(400).json({message: 'Chat ID is required in params'});
    }
    // Find the chat by chatId
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({message: 'Chat history not found'});
    }

    // Populate messages array from Message model
    const messages = await Message.find({_id: {$in: chat.messages}});
    // Send the messages as response
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({message: 'An error occurred while fetching chat history'});
  }
};
