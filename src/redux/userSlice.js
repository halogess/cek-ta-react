// src/redux/userSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Akan berisi username/NRP
  role: null, // Akan berisi 'admin' atau 'mahasiswa'
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Aksi yang dijalankan saat login berhasil
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
    },
    // Aksi untuk logout
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
    },
  },
});

// Ekspor aksi agar bisa digunakan di komponen lain
export const { loginSuccess, logout } = userSlice.actions;

// Ekspor reducer untuk digabungkan di store
export default userSlice.reducer;