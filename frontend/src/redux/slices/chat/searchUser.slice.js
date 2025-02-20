import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {toast} from 'react-toastify';

// Async thunk to perform search
export const searchUsers = createAsyncThunk(
  'search/searchUsers',

  async (query, {rejectWithValue}) => {
    const B_URL = import.meta.env.VITE_BACKEND_URL;
    try {
      // console.log("BEFORE searchUsers call api: ");
      // console.log("query ji in slice: ", query);

      const response = await axios.get(
        `${B_URL}/chat/searchUser?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      // console.error("Error in searchUsers:", error);
      return rejectWithValue(error.response?.data || 'Failed to search users ');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    results: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearResults: (state) => {
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        // console.log(action.error);
        state.error = action.error.message;
        toast.error(state.error);
      });
  },
});

export const {clearResults} = searchSlice.actions;
export default searchSlice.reducer;
