import {createSlice} from "@reduxjs/toolkit";

const leftDrawerSlice = createSlice({
  name: "leftDrawer",
  initialState: {
    isOpen: false, // Initial state of the drawer
    content: "chats", // This will track which smaller component to display
  },
  reducers: {
    openDrawerLeft: (state, action) => {
      state.isOpen = true;
      state.content = action.payload; // Set the component to display
    },
    closeDrawer: (state) => {
      state.isOpen = false;
    },
  },
});

export const {openDrawerLeft, closeDrawer, toggleSlide, setSlide} =
  leftDrawerSlice.actions;
export default leftDrawerSlice.reducer;
