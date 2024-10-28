// src/store/store.js
import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../redux/slices/auth.slice.js";
import chatReducer from "../redux/slices/chat.slice.js";
// import socketReducer from "./slices/socketSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // Manages user authentication state
    chat: chatReducer, // Manages chat-related data and actions
    // socket: socketReducer, // Manages socket connection and events
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disables serializable check for handling non-serializable values (like socket instances)
    }),
});
