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
   * Get dokumen by user ID (untuk mahasiswa)
   * @param {string} userId - NRP mahasiswa
   * @param {object} params - { status, search, sort }
   * @returns {Promise} Array of dokumen objects
   */
  getDokumenByUser: async (userId, params = {}) => {
    const backendParams = {};
    
    if (params.status && params.status !== 'Semua') {
      if (params.status === 'Menunggu') {
        backendParams.status = 'dalam_antrian,diproses';
      } else {
        const statusMap = {
          'Dibatalkan': 'dibatalkan',
          'Dalam Antrian': 'dalam_antrian',
          'Diproses': 'diproses',
          'Lolos': 'lolos',
          'Tidak Lolos': 'tidak_lolos'
        };
        backendParams.status = statusMap[params.status] || params.status.toLowerCase();
      }
    }
    
    if (params.sort) {
      backendParams.sort = params.sort === 'terlama' ? 'asc' : 'desc';
    }
    
    if (params.limit) {
      backendParams.limit = params.limit;
    }
    
    if (params.offset !== undefined) {
      backendParams.offset = params.offset;
    }
    
    return apiClient.get('/dokumen', { params: backendParams });
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
   * Check if user can upload document
   * @returns {Promise} { can_upload, reason }
   */
  canUpload: async () => {
    return apiClient.get('/dokumen/can-upload');
  },

  /**
   * Get document statistics for current user
   * @returns {Promise} { total, dibatalkan, dalam_antrian, diproses, lolos, tidak_lolos }
   */
  getDokumenStats: async () => {
    return apiClient.get('/dokumen/stats');
  },

  /**
   * Upload dokumen untuk validasi
   * @param {File} file - File dokumen (.docx)
   * @returns {Promise} { message, dokumen_id }
   */
  uploadDokumen: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.upload('/dokumen', formData);
  },

  /**
   * Upload buku (multiple files) untuk validasi
   * @param {File[]} files - Array of files
   * @param {string} judul - Judul buku
   * @returns {Promise} { message, buku_id }
   */
  uploadBook: async (files, judul) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('judul', judul);
    return apiClient.upload('/buku', formData);
  },



  /**
   * Get book validations by user
   * @param {string} userId - NRP mahasiswa
   * @param {object} params - { status, search, sort, limit, offset }
   * @returns {Promise} { data, total, limit, offset }
   */
  getBookValidationsByUser: async (userId, params = {}) => {
    const backendParams = {};
    
    if (params.status && params.status !== 'Semua') {
      if (params.status === 'Menunggu') {
        backendParams.status = 'dalam_antrian,diproses';
      } else {
        const statusMap = {
          'Dibatalkan': 'dibatalkan',
          'Dalam Antrian': 'dalam_antrian',
          'Diproses': 'diproses',
          'Lolos': 'lolos',
          'Tidak Lolos': 'tidak_lolos'
        };
        backendParams.status = statusMap[params.status] || params.status.toLowerCase();
      }
    }
    
    backendParams.sort = params.sort === 'terlama' ? 'asc' : 'desc';
    
    if (params.limit) backendParams.limit = params.limit;
    if (params.offset !== undefined) backendParams.offset = params.offset;
    

    return apiClient.get('/buku', { params: backendParams });
  },

  /**
   * Get book statistics for current user
   * @returns {Promise} { total, dalam_antrian, diproses, selesai_convert, lolos, tidak_lolos }
   */
  getBukuStats: async () => {
    return apiClient.get('/buku/stats');
  },

  getBukuJudul: async () => {
    return apiClient.get('/buku/judul');
  },

  /**
   * Check if user can upload book
   * @returns {Promise} { can_upload }
   */
  canUploadBook: async () => {
    return apiClient.get('/buku/can-upload');
  },

  /**
   * Get all book validations (admin)
   * @param {object} params - { status, sort, limit, offset, nrp }
   * @returns {Promise} { data, total, limit, offset }
   */
  getAllBookValidations: async (params = {}) => {
    return apiClient.get('/buku', { params });
  },

  /**
   * Get buku stats for admin
   * @param {string} nrp - Optional NRP filter
   * @returns {Promise} { total, dalam_antrian, diproses, selesai_convert, lolos, tidak_lolos, menunggu_validasi }
   */
  getBukuStatsAdmin: async (nrp = null) => {
    const params = nrp ? { nrp } : {};

    return apiClient.get('/buku/stats', { params });
  },

  /**
   * Cancel dokumen yang sedang dalam antrian
   * @param {number} id - Dokumen ID
   * @returns {Promise} { message }
   */
  cancelDokumen: async (id) => {
    return apiClient.patch(`/dokumen/${id}/batal`);
  },

  /**
   * Cancel buku yang sedang dalam antrian
   * @param {number} id - Buku ID
   * @returns {Promise} { message }
   */
  cancelBuku: async (id) => {
    return apiClient.patch(`/buku/${id}/batal`);
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
