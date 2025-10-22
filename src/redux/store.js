// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer, // Daftarkan reducer dari userSlice
  },
});