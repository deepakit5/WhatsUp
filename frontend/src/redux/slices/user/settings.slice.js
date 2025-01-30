import {createSlice} from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    activeTab: "",
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export const {setActiveTab} = settingsSlice.actions;

export default settingsSlice.reducer;
