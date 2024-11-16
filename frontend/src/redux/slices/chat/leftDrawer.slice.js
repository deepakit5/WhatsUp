import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  isOpen: false, // Initial state of the drawer
  content: null, // This will track which smaller component to display
};

const leftDrawerSlice = createSlice({
  name: "leftDrawer",
  initialState,
  reducers: {
    openDrawer: (state, action) => {
      state.isOpen = true;
      state.content = action.payload; // Set the component to display
    },
    closeDrawer: (state) => {
      state.isOpen = false;
      // state.content = null; // Reset the content when drawer is closed
    },
  },
});

export const {openDrawer, closeDrawer} = leftDrawerSlice.actions;
export default leftDrawerSlice.reducer;
