import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {toast} from 'react-toastify';

// Async thunk to fetch chat list from the server
export const fetchChatList = createAsyncThunk(
  'chat/fetchChatList',

  async (_, {rejectWithValue}) => {
    const B_URL = import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await axios.get(`${B_URL}/chat/getAllChats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // console.log('---- fetch Chat List response: ', response.data);
      return response.data;
    } catch (error) {
      console.log('Error in fetchChatList 111:', error);
      console.error('Error in fetchChatList:', error.response || error.message);
      return rejectWithValue(
        error.response?.data || {message: 'failed to fetch Chat list'}
      );
    }
  }
);

// The chat slice
const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chatsList: [], // Holds the fetched chat list
    unreadMessages: [],
    searchTerm: '', // Add searchQuery to the state
    filteredChatsList: [], // Holds the filtered chat list
    loading: false, // Can be 'idle', 'loading', 'succeeded', or 'failed'
    message: '',
    error: null, // For handling errors
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      console.log('search term is setted to zero');
    },
    // Action to filter the chat list based on search input
    filterChats: (state, action) => {
      state.searchTerm = action.payload.trim().toLowerCase();
      state.filteredChatsList = state.chatsList.filter((chat) =>
        chat.user.username
          .toLowerCase()
          .includes(state.searchTerm.toLowerCase())
      );
    },
    // move the chatlist to top if new msg is come
    updateChatList: (state, action) => {
      state.chatsList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchChatList.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchChatList.fulfilled, (state, action) => {
        state.chatsList = action.payload;
        // console.log('value of chatslist in redux : ', state.chatsList);
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(fetchChatList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch chat list';
      });
  },
});

export const {chatsList, filterChats, updateChatList, setSearchTerm} =
  chatSlice.actions;

export const selectchat = (state) => state.chat.filteredchat;

export default chatSlice.reducer;
