import apiClient from './client';

export const dashboardService = {
  getAdminStats: async () => {
    return apiClient.get('/dashboard/admin/stats');
  },

  getMahasiswaStats: async (userId) => {
    return apiClient.get(`/dashboard/mahasiswa/${userId}/stats`);
  },

  getErrorStatistics: async () => {
    return apiClient.get('/dashboard/admin/error-stats');
  },

  getSystemInfo: async () => {
    return apiClient.get('/dashboard/admin/system-info');
  },
};
