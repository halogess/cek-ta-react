export const storage = {
  setToken: (token) => {
    localStorage.setItem('auth_token', token);
  },

  getToken: () => {
    return localStorage.getItem('auth_token');
  },

  removeToken: () => {
    localStorage.removeItem('auth_token');
  },

  setUser: (user) => {
    localStorage.setItem('user_data', JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem('user_data');
    return user ? JSON.parse(user) : null;
  },

  removeUser: () => {
    localStorage.removeItem('user_data');
  },

  clear: () => {
    localStorage.clear();
  },
};
