import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

import socket from "../../../services/socket.service.js"; // Centralized socket setup

import axios from "axios";
import {toast} from "react-toastify";
import {io} from "socket.io-client";

let listenersInitialized = false;
// Async thunk to initialize socket listeners
export const chatWindowSocketListeners = createAsyncThunk(
  "chat/chatWindowSocketListeners",
  (_, {dispatch}) => {
    if (!listenersInitialized) {
      listenersInitialized = true;

      socket.on("messageSaved", (msgDetails, ack) => {
        dispatch(updateMessageId(msgDetails));

        dispatch(updateMessageStatus(msgDetails));

        // Call the acknowledgment callback to notify the server
        if (ack) {
          ack("ok");
        }
      });

      // Listener for `receiveMessage` event
      socket.on("receiveMessage", (message, ack) => {
        try {
          console.log("--- message received : ", message);
          dispatch(addMessage(message));

          // Send the acknowledgment using the provided callback
          if (ack) {
            ack({messageId: message._id, status: "received"});
          } else {
            console.error("--- No acknowledgment function provided.");
          }

          // Dispatch an action to store the message
        } catch (error) {
          console.error("Error in receiveMessage listener:", error);
        }
      });

      // server tells the sender that msg is delivered.
      socket.on("messageDelivered", (messageId) => {
        dispatch(updateMessageStatus({messageId, status: "delivered"}));
      });

      // Listen for read notifications
      // message-read-notify: Emitted by the server to notify the sender that the message has been read.
      socket.on("message-read-confirmation", (messageId) => {
        console.log("---- Message read confirmation :", messageId);

        // Update the UI to reflect that the message was read
        dispatch(updateMessageStatus({messageId, status: "read"}));
      });

      // Listener for `receiveMessage` event
      socket.on("deleteTheMessage", (messageId, ack) => {
        console.log("-------deleteTheMessage is listening.....");
        try {
          dispatch(deleteMessage(messageId));
        } catch (err) {
          console.error("deleteTheMessage: ", err);
        }

        ack({status: "message deleted succesfully at receiver side"});
      });
    }
  }
);

// Async thunk to load chat history for a selected chat
export const fetchChatHistory = createAsyncThunk(
  "chat/fetchChatHistory",
  async (chatId, {rejectWithValue}) => {
    const B_URL = import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await axios.get(`${B_URL}/chat/${chatId}/history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {message: "failed to fetch Chat History"}
      );
    }
  }
);

// Async thunk for sending/uploading media(image, video,file)
export const sendMessageMedia = createAsyncThunk(
  "chat/sendMediaMessage",
  async (file, {getState, rejectWithValue}) => {
    const B_URL = import.meta.env.VITE_BACKEND_URL;
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${B_URL}/message/upload-media`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for file uploads
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const chatWindowSlice = createSlice({
  name: "chatWindow",
  initialState: {
    chats: [], // List of chats
    selectedChat: null, // Selected chat details
    selectedUser: null, // selected user from new chat- new user
    newMessage: null,
    msgMediaUrl: "", // holds the url provided by the cloudinary
    messages: [], // list of Messages in the selected chat
    loading: false, // Loading state for fetch operations
    loadingForSending: false,
    errorForSending: false,
    message: "", //  by backend in response like operations successfull etc.
    error: null, // Error handling
  },
  reducers: {
    selectChat(state, action) {
      state.selectedUser = null;
      state.selectedChat = action.payload;
    },
    selectUser(state, action) {
      state.selectedChat = null;
      state.messages = [];
      state.selectedUser = action.payload;
    },
    setOpenChat(state, action) {
      state.openChatId = action.payload;
    },

    addMessageLocally(state, action) {
      state.newMessage = action.payload;
      state.messages.push(state.newMessage);
    },

    addMessage(state, action) {
      state.newMessage = action.payload;

      if (state.selectedChat?.chat?._id === state.newMessage.chatId) {
        state.messages.push(state.newMessage);
      } else {
        console.log("selected chat chat not found in add message ,");
      }
    },

    resetNewMessage(state) {
      state.newMessage = null;
    },

    updateMessageId(state, action) {
      const {tempId, messageId} = action.payload;

      // Find the message with the tempId and update its actualId

      const message = state.messages.find((msg) => msg.tempId === tempId);

      if (message) {
        message._id = messageId; // Replace tempId with actualId
      }
    },

    updateMessageStatus(state, action) {
      const {messageId, status} = action.payload;

      const message = state.messages.find((msg) => msg._id === messageId);
      if (message) {
        message.status = status; // Update status of the message
        console.log("msg is found and  setted status:", status);
      } else {
        console.log("message not found to update status in slice");
      }
    },

    deleteAllMessages(state) {
      state.messages = [];
    },
    deleteMessage(state, action) {
      const msgId = action.payload;
      state.messages = state.messages.filter((msg) => msg._id !== msgId);
    },
  },
  extraReducers: (builder) => {
    builder
      // Handling fetchChatHistory thunk
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loading = false;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.messages = [];
      });

    // Handle sendMediaMessage cases
    builder
      .addCase(sendMessageMedia.pending, (state) => {
        state.loadingForSending = true;
        state.msgMediaUrl = "";
      })
      .addCase(sendMessageMedia.fulfilled, (state, action) => {
        state.msgMediaUrl = action.payload.data;
      })
      .addCase(sendMessageMedia.rejected, (state, action) => {
        state.loadingForSending = false;
        state.errorForSending = action.payload.message;
        toast.error(state.error);
      });
  },
});

export const {
  selectChat,
  selectUser,
  addMessageLocally,
  addMessage,
  resetNewMessage,
  updateMessageId,
  updateMessageStatus,
  deleteAllMessages,
  deleteMessage,
} = chatWindowSlice.actions;

export default chatWindowSlice.reducer;
