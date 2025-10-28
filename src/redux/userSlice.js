/**
 * User Slice - Redux state untuk authentication
 * Mengelola state user, role, dan status authentication
 * dengan persistence ke localStorage
 */

import { createSlice } from '@reduxjs/toolkit';

/**
 * Load data user dari localStorage saat aplikasi dimuat
 * Untuk maintain session setelah refresh
 */
const loadFromStorage = () => {
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('user_data');
  return token && user ? JSON.parse(user) : null;
};

// Load saved user data
const savedUser = loadFromStorage();

// Initial state - restore dari localStorage jika ada
const initialState = {
  user: savedUser?.nrp || null, // NRP mahasiswa atau 'admin'
  role: savedUser?.role || null, // 'admin' atau 'mahasiswa'
  isAuthenticated: !!savedUser, // true jika ada saved user
};

// Slice untuk user state
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Action untuk login berhasil
     * Simpan data user ke state dan localStorage
     */
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
      // Persist ke localStorage
      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('user_data', JSON.stringify({ nrp: action.payload.user, role: action.payload.role }));
    },
    /**
     * Action untuk logout
     * Clear state dan localStorage
     */
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    },
  },
});

// Export actions untuk digunakan di components
export const { loginSuccess, logout } = userSlice.actions;

// Export reducer untuk store
export default userSlice.reducer;