import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {toast} from "react-toastify";

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
      localStorage.setItem("token", token); // Store token in localStorage

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, {rejectWithValue}) => {
    const B_URL = import.meta.env.VITE_BACKEND_URL;

    try {
      const {data} = await axios.post(`${B_URL}/auth/forgot-password`, {
        email,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({token, password}, {rejectWithValue}) => {
    const B_URL = import.meta.env.VITE_BACKEND_URL;

    try {
      const {data} = await axios.post(`${B_URL}/auth/reset-password/${token}`, {
        password,
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Define the slice, which holds the state, reducers, and extraReducers for asynchronous actions
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || "",
    isAuthenticated: false,
    message: "",
    loading: false,
    success: false,
    error: false,
  },
  reducers: {
    // Define a synchronous reducer for logging out the user
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      // localStorage.removeItem("token");
    },
    resetSuccess: (state) => {
      state.success = false;
    },
    resetError: (state) => {
      state.error = null;
    },

    clearMessage: (state) => {
      state.message = "";
      state.error = null;
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
        state.isAuthenticated = true;

        state.token = action.payload.data.accessToken;

        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(state.error);
      });

    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(state.error);
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(state.error);
      });
  },
});

export const {logout, resetSuccess, resetError, clearMessage} =
  authSlice.actions;
export default authSlice.reducer;
