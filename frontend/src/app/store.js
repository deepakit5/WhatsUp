// src/store/store.js
import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authentication/auth.slice.js";
import userReducer from "../redux/slices/user/user.slice.js";
import chatReducer from "../redux/slices/chat/chatWindow.slice.js";
import leftDrawerReducer from "../redux/slices/chat/leftDrawer.slice.js";
import chatListReducer from "../redux/slices/chat/chatList.slice.js";

// import socketReducer from "./slices/socketSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // Manages user authentication state
    chat: chatReducer, // Manages chat-related data and actions
    // socket: socketReducer, // Manages socket connection and events
    user: userReducer,
    leftDrawer: leftDrawerReducer,
    chatList: chatListReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disables serializable check for handling non-serializable values (like socket instances)
    }),
});
