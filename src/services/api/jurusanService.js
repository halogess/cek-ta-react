/**
 * Jurusan Service
 * Menangani operasi terkait data jurusan
 */

import apiClient from './client';

export const jurusanService = {
  /**
   * Get semua jurusan (untuk admin)
   * @returns {Promise} Array of jurusan objects [{ kode, nama }]
   */
  getAllJurusan: async () => {
    return apiClient.get('/jurusan');
  },
};
