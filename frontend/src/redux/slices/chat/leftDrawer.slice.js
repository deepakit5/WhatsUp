import {createSlice} from "@reduxjs/toolkit";

const leftDrawerSlice = createSlice({
  name: "leftDrawer",
  initialState: {
    isOpen: false, // Initial state of the drawer
    content: "chats", // This will track which smaller component to display
    // slideIn: false, // Initial state for the Slide "in" property
  },
  reducers: {
    openDrawer: (state, action) => {
      state.isOpen = true;
      // state.in = true;
      state.content = action.payload; // Set the component to display
    },
    closeDrawer: (state) => {
      state.isOpen = false;
      // state.in = false;
      // state.content = null; // Reset the content when drawer is closed
    },
    // toggleSlide: (state) => {
    //   state.in = !state.in;
    // },
    // setSlide: (state, action) => {
    //   state.in = action.payload;
    // },
  },
});

export const {openDrawer, closeDrawer, toggleSlide, setSlide} =
  leftDrawerSlice.actions;
export default leftDrawerSlice.reducer;
