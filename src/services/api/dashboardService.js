/**
 * Dashboard Service
 * Menangani operasi terkait statistik dashboard:
 * - Stats untuk admin dan mahasiswa
 * - Error statistics
 * - System info
 */

import apiClient from './client';

export const dashboardService = {
  /**
   * Get statistik untuk admin dashboard
   * @returns {Promise} { total, waiting, passed, needsFix }
   */
  getAdminStats: async () => {
    return apiClient.get('/dashboard/admin/stats');
  },

  /**
   * Get statistik untuk mahasiswa dashboard
   * @param {string} userId - NRP mahasiswa
   * @returns {Promise} { total, waiting, cancelled, passed, needsFix }
   */
  getMahasiswaStats: async (userId) => {
    return apiClient.get(`/dashboard/mahasiswa/${userId}/stats`);
  },

  /**
   * Get statistik error (untuk chart di admin dashboard)
   * @returns {Promise} Array of { name, count, percentage }
   */
  getErrorStatistics: async () => {
    return apiClient.get('/dashboard/admin/error-stats');
  },

  /**
   * Get info sistem (validasi hari ini, avg time, success rate)
   * @returns {Promise} { todayValidations, avgTime, successRate }
   */
  getSystemInfo: async () => {
    return apiClient.get('/dashboard/admin/system-info');
  },
};
