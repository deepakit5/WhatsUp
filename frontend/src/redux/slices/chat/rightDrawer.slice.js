import {createSlice} from "@reduxjs/toolkit";

const rightDrawerSlice = createSlice({
  name: "rightDrawer",
  initialState: {
    isOpen: false, // Initial state of the drawer
    content: "default", // This will track which smaller component to display
  },
  reducers: {
    openDrawerRight: (state, action) => {
      state.isOpen = true;
      state.content = action.payload; // Set the component to display
    },
    closeDrawerRight: (state) => {
      state.isOpen = false;
    },
  },
});

export const {openDrawerRight, closeDrawerRight} = rightDrawerSlice.actions;
export default rightDrawerSlice.reducer;
