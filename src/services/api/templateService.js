/**
 * Template Service
 * Menangani operasi terkait template panduan:
 * - CRUD template
 * - Activate/deactivate template
 * - Update format rules
 * - Download template
 */

import apiClient from './client';

export const templateService = {
  /**
   * Get semua template yang ada di sistem
   * @returns {Promise} Array of template objects dengan formatRules
   */
  getAllTemplates: async () => {
    return apiClient.get('/templates');
  },

  /**
   * Get template by ID
   * @param {number} id - Template ID
   * @returns {Promise} Template object
   */
  getTemplateById: async (id) => {
    return apiClient.get(`/templates/${id}`);
  },

  /**
   * Upload template baru (.docx)
   * @param {File} file - Template file
   * @returns {Promise} { id, name, message }
   */
  uploadTemplate: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.upload('/templates/upload', formData);
  },

  /**
   * Update template (nama, version, dll)
   * @param {number} id - Template ID
   * @param {object} data - { name, version }
   * @returns {Promise} { message }
   */
  updateTemplate: async (id, data) => {
    return apiClient.put(`/templates/${id}`, data);
  },

  /**
   * Delete template
   * @param {number} id - Template ID
   * @returns {Promise} { message }
   */
  deleteTemplate: async (id) => {
    return apiClient.delete(`/templates/${id}`);
  },

  /**
   * Activate template (set sebagai template aktif)
   * @param {number} id - Template ID
   * @returns {Promise} { message }
   */
  activateTemplate: async (id) => {
    return apiClient.put(`/templates/${id}/activate`);
  },

  /**
   * Update format rules template
   * @param {number} id - Template ID
   * @param {object} rules - { formatRules: { page_settings, components } }
   * @returns {Promise} { message }
   */
  updateFormatRules: async (id, rules) => {
    return apiClient.put(`/templates/${id}/rules`, rules);
  },

  /**
   * Get template yang sedang aktif
   * @returns {Promise} Template object
   */
  getActiveTemplate: async () => {
    return apiClient.get('/templates/active');
  },

  /**
   * Download template file
   * @param {number} id - Template ID
   * @returns {Promise} Blob (DOCX file)
   */
  downloadTemplate: async (id) => {
    return apiClient.get(`/templates/${id}/download`, { responseType: 'blob' });
  },
};
