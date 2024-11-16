// src/redux/slices/userSlice.js
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching user data
export const fetchMyProfile = createAsyncThunk(
  "user/fetchMyProfile", // Action type string for the thunk

  async (_, {rejectWithValue}) => {
    const B_URL = import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await axios.get(`${B_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // console.log("response in user slice ", response.data);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch profile");
    }
  }
);

// Async thunk for updating user data
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (updatedData, {getState, rejectWithValue}) => {
    const B_URL = import.meta.env.VITE_BACKEND_URL;
    try {
      const {userId} = getState().user;
      const token = localStorage.getItem("token"); // Get the JWT token from local storage (or wherever you stored it)

      const response = await axios.patch(
        `${B_URL}/user/update/me`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating updateProfileImg
export const updateProfileImg = createAsyncThunk(
  "user/updateProfileImg",
  async (file, {getState, rejectWithValue}) => {
    const B_URL = import.meta.env.VITE_BACKEND_URL;
    try {
      // const {userId} = getState().user;
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.patch(
        `${B_URL}/user/update-avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for file uploads
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: "",
    username: "",
    // username: "anonymous",

    profileImage: "",
    about: "",
    // about: "hey there, i am using WhatsUp not WhatsApp.",
    email: "",
    phoneNumber: "",
    isLoading: false,
    error: null,
  },
  reducers: {
    setProfileField: (state, action) => {
      const {field, value} = action.payload;
      state[field] = value;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchUser cases
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.userId = action.payload.__id;
        // state.user = action.payload.data;
        state.username = action.payload.username;
        state.profileImage = action.payload.avatar;
        state.phoneNumber = action.payload.phoneNumber;
        state.about = action.payload.about;
        state.email = action.payload.email;
        state.isLoading = false;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Handle updateUser cases
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.username = action.payload.username || state.username;
        state.about = action.payload.about || state.about;
        state.email = action.payload.email || state.email;
        state.phoneNumber = action.payload.phoneNumber || state.phoneNumber;
        state.isLoading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });

    // Handle updateProfileImg cases
    builder
      .addCase(updateProfileImg.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfileImg.fulfilled, (state, action) => {
        state.profileImage = action.payload.avatar || state.profileImage;
        state.isLoading = false;
      })
      .addCase(updateProfileImg.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const {setProfileField} = userSlice.actions;

export default userSlice.reducer;
