/**
 * Authentication Service
 * Menangani operasi authentication: login, logout, get current user
 */

import apiClient from './client';

export const authService = {
  /**
   * Login user (admin atau mahasiswa)
   * @param {string} nrp - NRP mahasiswa atau 'admin'
   * @param {string} password - Password user
   * @returns {Promise} { token, user: { nrp, role } }
   */
  login: async (nrp, password) => {
    return apiClient.post('/auth/login', { nrp, password });
  },

  /**
   * Logout user - invalidate token di server
   * @returns {Promise} { message }
   */
  logout: async () => {
    return apiClient.post('/auth/logout');
  },

  /**
   * Get data user yang sedang login
   * @returns {Promise} { nrp, nama, role, jurusan }
   */
  getCurrentUser: async () => {
    return apiClient.get('/auth/me');
  },
};
