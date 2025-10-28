/**
 * Validation Service
 * Menangani operasi terkait validasi dokumen:
 * - Upload dokumen
 * - Get validasi (semua/by user/by id)
 * - Cancel validasi
 * - Download certificate
 * - Get errors dan structure
 */

import apiClient from './client';

export const validationService = {
  /**
   * Get semua validasi dengan filtering (untuk admin)
   * @param {object} params - { status, prodi, startDate, endDate, search, sort }
   * @returns {Promise} Array of validation objects
   */
  getAllValidations: async (params = {}) => {
    return apiClient.get('/validations', { params });
  },

  /**
   * Get validasi by user ID (untuk mahasiswa)
   * @param {string} userId - NRP mahasiswa
   * @returns {Promise} Array of validation objects
   */
  getValidationsByUser: async (userId) => {
    return apiClient.get(`/validations/user/${userId}`);
  },

  /**
   * Get detail validasi by ID
   * @param {number} id - Validation ID
   * @returns {Promise} Validation object dengan detail lengkap
   */
  getValidationById: async (id) => {
    return apiClient.get(`/validations/${id}`);
  },

  /**
   * Upload dokumen untuk validasi
   * @param {File} file - File dokumen (.docx)
   * @param {object} metadata - { judulTA, nrp }
   * @returns {Promise} { id, status, message }
   */
  uploadDocument: async (file, metadata) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));
    return apiClient.upload('/validations/upload', formData);
  },

  /**
   * Cancel validasi yang sedang dalam antrian
   * @param {number} id - Validation ID
   * @returns {Promise} { message }
   */
  cancelValidation: async (id) => {
    return apiClient.put(`/validations/${id}/cancel`);
  },

  /**
   * Download certificate untuk validasi yang lolos
   * @param {number} id - Validation ID
   * @returns {Promise} Blob (PDF file)
   */
  downloadCertificate: async (id) => {
    return apiClient.get(`/validations/${id}/certificate`, { responseType: 'blob' });
  },

  /**
   * Get daftar error dari hasil validasi
   * @param {number} id - Validation ID
   * @returns {Promise} Array of error objects
   */
  getValidationErrors: async (id) => {
    return apiClient.get(`/validations/${id}/errors`);
  },

  /**
   * Get struktur dokumen (BAB, sections, stats)
   * @param {number} id - Validation ID
   * @returns {Promise} Array of chapter objects dengan sections
   */
  getDocumentStructure: async (id) => {
    return apiClient.get(`/validations/${id}/structure`);
  },
};
