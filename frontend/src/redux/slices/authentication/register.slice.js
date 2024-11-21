import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {toast} from "react-toastify";

export const registerUser = createAsyncThunk(
  "register/registerUser",
  async (formData, {rejectWithValue}) => {
    const B_URL = import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await axios.post(`${B_URL}/auth/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("response of registerUser slice ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const registerSlice = createSlice({
  name: "register",
  initialState: {
    user: null,
    loading: false,
    message: "",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        // toast.success("User Registered Successfully.");
        state.message = action.payload.message;
        toast.success(state.message);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(state.error);
      });
  },
});

export default registerSlice.reducer;
