// src/store/store.js
import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authentication/auth.slice.js";
import userReducer from "../redux/slices/user/user.slice.js";
import searchReducer from "../redux/slices/chat/searchUser.slice.js";
import leftDrawerReducer from "../redux/slices/chat/leftDrawer.slice.js";
import rightDrawerReducer from "../redux/slices/chat/rightDrawer.slice.js";
import chatReducer from "../redux/slices/chat/chat.slice.js";
import registerReducer from "../redux/slices/authentication/register.slice.js";
import settingsReducer from "../redux/slices/user/settings.slice.js";
import chatWindowReducer from "../redux/slices/chat/chatWindow.slice.js";
import chatWindowHeaderReducer from "../redux/slices/chat/chatWindowHeader.slice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer, // Manages user authentication state
    register: registerReducer,
    chat: chatReducer, // Manages chat-related data and actions
    user: userReducer,
    search: searchReducer,
    settings: settingsReducer,
    leftDrawer: leftDrawerReducer,
    rightDrawer: rightDrawerReducer,
    chatWindow: chatWindowReducer,
    chatWindowHeader: chatWindowHeaderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disables serializable check for handling non-serializable values (like socket instances)
    }),
});
