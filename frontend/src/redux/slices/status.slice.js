import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import socket from '../../services/socket.service.js'; // Centralized socket setup

import axios from 'axios';
import {useDispatch} from 'react-redux';
import {toast} from 'react-toastify';
// const dispatch = useDispatch();
// Async Thunks
export const uploadStatus = createAsyncThunk(
  'status/uploadStatus',
  async (formData, {dispatch, rejectWithValue}) => {
    const B_URL = import.meta.env.VITE_BACKEND_URL;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${B_URL}/status/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.data) {
        dispatch(fetchMyStatuses);
      }
      // console.log('---- response from upload status:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// my status
export const fetchMyStatuses = createAsyncThunk(
  'status/fetchMyStatuses',
  async (_, {rejectWithValue}) => {
    const B_URL = import.meta.env.VITE_BACKEND_URL;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${B_URL}/status/myStatuses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log('response from fetch my status:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching statuses');
    }
  }
);

// others status

export const fetchStatusList = createAsyncThunk(
  'status/fetchStatusList',
  async (_, {rejectWithValue}) => {
    const B_URL = import.meta.env.VITE_BACKEND_URL;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${B_URL}/status/getAllStatus`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log('response of status-list:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching statuses');
    }
  }
);

// Send reply
export const sendReply = createAsyncThunk(
  'status/sendReply',
  async ({statusId, message}, {rejectWithValue}) => {
    try {
      const {data} = await axios.post(
        '/api/statuses/reply',
        {statusId, message},
        {withCredentials: true}
      );
      socket.emit('sendReply', {statusId, message});
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error sending reply');
    }
  }
);

export const fetchStatusSeenList = createAsyncThunk(
  'status/fetchStatusSeenList',
  async (statusId) => {
    const response = await axios.get(`/api/status/seen/${statusId}`);
    return response.data.viewers;
  }
);
// ----------x--------------x--------------
// ----------x--------------x--------------
let listenersInitialized = false;
// Async thunk to initialize socket listeners
export const statusSocketListeners = createAsyncThunk(
  'status/statusSocketListeners',
  (_, {dispatch}) => {
    if (!listenersInitialized) {
      listenersInitialized = true;

      // Listen for new replies
      // socket.on('newReply', (data) => {
      //   store.dispatch(addNewReply(data));
      // });

      // Listener for `receive reply Message on status` event
      socket.on('statusReply', (data, ack) => {
        try {
          // console.log('--- statusReply received : ', data);
          dispatch(addNewReply(data));

          // Send the acknowledgment using the provided callback
          if (ack) {
            ack({status: 'received'});
          } else {
            // console.error('--- No acknowledgment function provided.');
          }
          // Dispatch an action to store the message
        } catch (error) {
          // console.error('Error in status Reply listener:', error);
        }
      });

      socket.on('status-seen-notify', (data) => {
        try {
          // console.log('--- status-seen-notify : ', data);
          dispatch(addViewer(data));
        } catch (error) {
          // console.log(error);
        }
      });
    }
  }
);
// ----------x--------------x--------------

const statusSlice = createSlice({
  name: 'status',

  initialState: {
    myStatuses: [],
    viewers: [],
    replies: [],
    openStatusUpload: false,
    statusList: [],

    loading: false,
    error: null,
  },
  reducers: {
    addNewReply: (state, {payload}) => {
      const status = state.myStatuses.find((s) => s._id === payload.statusId);
      if (status) status.replies.push(payload);
    },

    setOpenStatusUpload: (state, {payload}) => {
      state.openStatusUpload = payload;
    },

    addViewer: (state, {payload}) => {
      state.viewers.unshift(payload); // Inserts payload at the start of the array
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadStatus.fulfilled, (state, {payload}) => {
        // useDispatch(fetchMyStatuses);
        state.myStatuses.push(payload);
        state.loading = false;
        toast.success(`${payload.message}`);
      })
      .addCase(fetchMyStatuses.fulfilled, (state, {payload}) => {
        state.myStatuses = payload;
      })
      .addCase(fetchStatusList.fulfilled, (state, {payload}) => {
        state.statusList = payload;
      })
      .addCase(sendReply.fulfilled, (state, action) => {
        const status = state.myStatuses.find(
          (s) => s._id === action.payload._id
        );
        if (status) status.replies = action.payload.replies;
      })
      .addCase(fetchStatusSeenList.fulfilled, (state, action) => {
        state.seenList = action.payload;
      });
  },
});

export const {addNewReply, setOpenStatusUpload, addViewer} =
  statusSlice.actions;

export default statusSlice.reducer;
