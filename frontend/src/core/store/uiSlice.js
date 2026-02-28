import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mobileMenuOpen: false,
  notifications: [],
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
    addNotification: (state, action) => {
      if (!state.notifications) state.notifications = [];
      state.notifications.push(action.payload);
    },
  },
});

export const { toggleMobileMenu, setMobileMenuOpen, closeMobileMenu, addNotification } = uiSlice.actions;
export default uiSlice.reducer;
