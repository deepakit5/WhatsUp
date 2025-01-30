import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {toast} from "react-toastify";

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
    username: "anonymous",
    isOnline: "offline", // for real time update depend on socket
    chatsList: [],
    profileImage: "Your profile Image",
    about: "hey there, i am using WhatsUp not WhatsApp.",
    email: "",
    phoneNumber: "",
    loading: false,
    message: "",
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.userId = action.payload._id;
        state.username = action.payload.username;
        state.profileImage = action.payload.avatar;
        state.phoneNumber = action.payload.phoneNumber;
        state.about = action.payload.about;
        state.email = action.payload.email;
        state.chatsList = action.payload.chatsList;
        state.loading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(state.error);
      });

    // Handle updateUser cases
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.username = action.payload.username || state.username;
        state.about = action.payload.about || state.about;
        state.email = action.payload.email || state.email;
        state.phoneNumber = action.payload.phoneNumber || state.phoneNumber;
        state.loading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(state.error);
      });

    // Handle updateProfileImg cases
    builder
      .addCase(updateProfileImg.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfileImg.fulfilled, (state, action) => {
        state.profileImage = action.payload.avatar || state.profileImage;
        state.loading = false;
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(updateProfileImg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(state.error);
      });
  },
});

export const {setProfileField} = userSlice.actions;

export default userSlice.reducer;
