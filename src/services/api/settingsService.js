/**
 * Settings Service
 * Menangani operasi terkait pengaturan sistem:
 * - Minimum score untuk lulus validasi
 * - System settings lainnya
 */

import apiClient from './client';

export const settingsService = {
  /**
   * Get minimum score untuk lulus validasi
   * @returns {Promise} { score }
   */
  getMinScore: async () => {
    return apiClient.get('/settings/min-score');
  },

  /**
   * Update minimum score
   * @param {number} score - Minimum score (0-100)
   * @returns {Promise} { score }
   */
  updateMinScore: async (score) => {
    return apiClient.put('/settings/min-score', { score });
  },

  /**
   * Get semua system settings
   * @returns {Promise} { minScore, maxFileSize, allowedFormats, ... }
   */
  getSystemSettings: async () => {
    return apiClient.get('/settings');
  },

  /**
   * Update system settings
   * @param {object} settings - Settings object
   * @returns {Promise} { message }
   */
  updateSystemSettings: async (settings) => {
    return apiClient.put('/settings', settings);
  },
};
