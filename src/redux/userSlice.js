import { createSlice } from '@reduxjs/toolkit';

const loadFromStorage = () => {
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('user_data');
  return token && user ? JSON.parse(user) : null;
};

const savedUser = loadFromStorage();

const initialState = {
  user: savedUser?.nrp || null,
  role: savedUser?.role || null,
  isAuthenticated: !!savedUser,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('user_data', JSON.stringify({ nrp: action.payload.user, role: action.payload.role }));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;