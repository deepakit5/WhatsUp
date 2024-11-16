import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
// import {io} from "socket.io-client";
// import {fetchCurrentUser} from "../user/user.slices";

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

      const token = response.data.data.accessToken;
      // const { token } = response.data;// check this line
      localStorage.setItem("token", token); // Store token in localStorage

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
    token: localStorage.getItem("token") || null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    // Define a synchronous reducer for logging out the user
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  // Define extraReducers to handle async thunk actions
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        // state.user = action.payload.user;
        state.token = action.payload.data.accessToken;
        // state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {logout} = authSlice.actions;
export default authSlice.reducer;
