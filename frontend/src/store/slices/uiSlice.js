import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
  },
});

export const { toggleMobileMenu, setMobileMenuOpen, closeMobileMenu } = uiSlice.actions;
export default uiSlice.reducer;
