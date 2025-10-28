import apiClient from './client';

export const userService = {
  getUserById: async (id) => {
    return apiClient.get(`/users/${id}`);
  },

  getUserByNrp: async (nrp) => {
    return apiClient.get(`/users/nrp/${nrp}`);
  },

  getAllUsers: async () => {
    return apiClient.get('/users');
  },
};
