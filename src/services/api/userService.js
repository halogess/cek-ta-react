/**
 * User Service
 * Menangani operasi terkait data user/mahasiswa:
 * - Get user by ID atau NRP
 * - Get all users
 */

import apiClient from './client';

export const userService = {
  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise} { id, nrp, nama, jurusan, email }
   */
  getUserById: async (id) => {
    return apiClient.get(`/users/${id}`);
  },

  /**
   * Get user by NRP
   * @param {string} nrp - NRP mahasiswa
   * @returns {Promise} { id, nrp, nama, jurusan, email }
   */
  getUserByNrp: async (nrp) => {
    return apiClient.get(`/users/nrp/${nrp}`);
  },

  /**
   * Get semua users (untuk admin)
   * @returns {Promise} Array of user objects
   */
  getAllUsers: async () => {
    return apiClient.get('/users');
  },

  /**
   * Get daftar status mahasiswa non-aktif
   * @returns {Promise} Array of { value, label }
   */
  getNonActiveStatus: async () => {
    return apiClient.get('/mahasiswa/nonactive/status');
  },

  /**
   * Get daftar angkatan mahasiswa non-aktif
   * @returns {Promise} Array of string (tahun angkatan)
   */
  getNonActiveAngkatan: async () => {
    return apiClient.get('/mahasiswa/nonactive/angkatan');
  },

  /**
   * Get daftar jurusan mahasiswa non-aktif
   * @returns {Promise} Array of { kode, nama, singkatan }
   */
  getNonActiveJurusan: async () => {
    return apiClient.get('/mahasiswa/nonactive/jurusan');
  },
};
