/**
 * Authentication Service
 * Menangani operasi authentication: login, logout, get current user
 */

import apiClient from './client';

export const authService = {
  /**
   * Login user (admin atau mahasiswa)
   * @param {string} username - Username mahasiswa atau 'admin'
   * @param {string} password - Password user
   * @returns {Promise} { access_token, refresh_token, user: { nrp, role } }
   */
  login: async (username, password) => {
    const response = await apiClient.post('/auth/login', { username, password });
    
    // Simpan tokens ke localStorage
    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token);
    }
    if (response.refresh_token) {
      localStorage.setItem('refresh_token', response.refresh_token);
    }
    
    return response;
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
