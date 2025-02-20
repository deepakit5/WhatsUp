import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import socket from '../../../services/socket.service.js'; // Centralized socket setup

let listenersInitialized = false;
// Async thunk to initialize socket listeners
export const chatWindowHeaderSocketListeners = createAsyncThunk(
  'chat/chatWindowHeaderSocketListeners',
  (_, {dispatch}) => {
    if (!listenersInitialized) {
      listenersInitialized = true;
      socket.on('userOnline', ({userId}) => {
        dispatch(setOnlineStatus({userId, status: 'online'}));
      });

      socket.on('userOffline', ({userId}) => {
        // console.log("userOffline listener userId : ", userId);

        dispatch(setOnlineStatus({userId, status: 'offline'}));
      });
    }
  }
);

const chatWindowHeaderSlice = createSlice({
  name: 'chatWindowHeader',
  initialState: {
    onlineUserId: '',
    isOnline: '',
    loading: false, // Loading state for fetch operations
    message: '', //  by backend in response like operations successfull etc.
    error: null, // Error handling
  },
  reducers: {
    setOnlineStatus(state, action) {
      const {userId, status} = action.payload;
      state.onlineUserId = userId;
      state.isOnline = status;
    },
  },
});

export const {setOnlineStatus} = chatWindowHeaderSlice.actions;

export default chatWindowHeaderSlice.reducer;
