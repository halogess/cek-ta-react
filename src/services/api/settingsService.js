import apiClient from './client';

export const settingsService = {
  getMinScore: async () => {
    return apiClient.get('/settings/min-score');
  },

  updateMinScore: async (score) => {
    return apiClient.put('/settings/min-score', { score });
  },

  getSystemSettings: async () => {
    return apiClient.get('/settings');
  },

  updateSystemSettings: async (settings) => {
    return apiClient.put('/settings', settings);
  },
};
