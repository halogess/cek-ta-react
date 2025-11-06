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
  const accessToken = localStorage.getItem('access_token');
  const user = localStorage.getItem('user_data');
  return accessToken && user ? JSON.parse(user) : null;
};

// Load saved user data
const savedUser = loadFromStorage();

// Initial state - restore dari localStorage jika ada
const initialState = {
  user: savedUser?.username || null, // Username (NRP mahasiswa atau 'admin')
  nama: savedUser?.nama || null, // Nama lengkap user
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
      console.log('📥 Redux loginSuccess called with:', action.payload);
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.nama = action.payload.nama;
      state.role = action.payload.role;
      // Persist ke localStorage
      if (action.payload.accessToken) {
        localStorage.setItem('access_token', action.payload.accessToken);
        console.log('✅ access_token saved to localStorage');
      }
      if (action.payload.refreshToken) {
        localStorage.setItem('refresh_token', action.payload.refreshToken);
        console.log('✅ refresh_token saved to localStorage');
      }
      localStorage.setItem('auth_token', action.payload.token || action.payload.accessToken);
      localStorage.setItem('user_data', JSON.stringify({ 
        username: action.payload.user, 
        nama: action.payload.nama,
        role: action.payload.role 
      }));
      console.log('✅ Redux state updated:', { user: state.user, role: state.role, isAuthenticated: state.isAuthenticated });
    },
    /**
     * Action untuk logout
     * Clear state dan localStorage
     */
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.nama = null;
      state.role = null;
      // Clear localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    },
  },
});

// Export actions untuk digunakan di components
export const { loginSuccess, logout } = userSlice.actions;

// Export reducer untuk store
export default userSlice.reducer;