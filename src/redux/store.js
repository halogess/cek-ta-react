/**
 * Redux Store Configuration
 * Mengkonfigurasi Redux store dengan Redux Toolkit
 * Store ini menyimpan state global aplikasi (authentication)
 */

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

// Konfigurasi store dengan reducer
export const store = configureStore({
  reducer: {
    user: userReducer, // Reducer untuk mengelola state user/authentication
  },
});