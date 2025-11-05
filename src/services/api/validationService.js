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
   * @param {object} params - { status, search, sort }
   * @returns {Promise} Array of validation objects
   */
  getValidationsByUser: async (userId, params = {}) => {
    return apiClient.get(`/validations/user/${userId}`, { params });
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
   * Upload buku (multiple files) untuk validasi
   * @param {File[]} files - Array of files
   * @param {object} metadata - { judulBuku, nrp, numChapters }
   * @returns {Promise} { id, status, message }
   */
  uploadBook: async (files, metadata) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    formData.append('metadata', JSON.stringify(metadata));
    return apiClient.upload('/validations/upload-book', formData);
  },

  /**
   * Get book validations by user
   * @param {string} userId - NRP mahasiswa
   * @param {object} params - { status, search, sort }
   * @returns {Promise} Array of book validation objects
   */
  getBookValidationsByUser: async (userId, params = {}) => {
    return apiClient.get(`/validations/books/user/${userId}`, { params });
  },

  /**
   * Get judul buku by user (from latest book validation)
   * @param {string} userId - NRP mahasiswa
   * @returns {Promise} { judulBuku }
   */
  getJudulBukuByUser: async (userId) => {
    return apiClient.get(`/validations/books/user/${userId}/judul`);
  },

  /**
   * Get all book validations (untuk admin)
   * @param {object} params - { status, prodi, startDate, endDate, search, sort }
   * @returns {Promise} Array of book validation objects
   */
  getAllBookValidations: async (params = {}) => {
    return apiClient.get('/validations/books', { params });
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

  /**
   * Get recommendations untuk perbaikan dokumen
   * @param {number} id - Validation ID
   * @returns {Promise} Array of recommendation objects
   */
  getRecommendations: async (id) => {
    return apiClient.get(`/validations/${id}/recommendations`);
  },

  /**
   * Get document preview dengan error highlighting
   * @param {number} id - Validation ID
   * @param {number} errorIndex - Index of error to preview
   * @returns {Promise} Preview data dengan highlight area
   */
  getDocumentPreview: async (id, errorIndex) => {
    return apiClient.get(`/validations/${id}/preview/${errorIndex}`);
  },
};
