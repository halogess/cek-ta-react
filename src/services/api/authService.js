import apiClient from './client';

export const authService = {
  login: async (nrp, password) => {
    return apiClient.post('/auth/login', { nrp, password });
  },

  logout: async () => {
    return apiClient.post('/auth/logout');
  },

  getCurrentUser: async () => {
    return apiClient.get('/auth/me');
  },
};
