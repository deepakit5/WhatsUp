import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to handle login
export const loginUser = createAsyncThunk(
  "auth/loginUser", // Action type string for the thunk
  async ({email, password}, {rejectWithValue}) => {
    const B_URL = import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await axios.post(`${B_URL}/auth/login`, {
        email,
        password,
      });
      return response.data; // Assuming response contains user data or token
    } catch (error) {
      // If there's an error, pass it to rejectWithValue to handle the error in reducers
      return rejectWithValue(error.response.data);
    }
  }
);

// Define the slice, which holds the state, reducers, and extraReducers for asynchronous actions
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    // Define a synchronous reducer for logging out the user
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
  // Define extraReducers to handle async thunk actions
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the logout action to allow components to dispatch it
export const {logout} = authSlice.actions;
// Export the reducer to integrate it into the store
export default authSlice.reducer;
