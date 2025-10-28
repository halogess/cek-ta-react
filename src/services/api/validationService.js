import apiClient from './client';

export const validationService = {
  getAllValidations: async (params = {}) => {
    return apiClient.get('/validations', { params });
  },

  getValidationsByUser: async (userId) => {
    return apiClient.get(`/validations/user/${userId}`);
  },

  getValidationById: async (id) => {
    return apiClient.get(`/validations/${id}`);
  },

  uploadDocument: async (file, metadata) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));
    return apiClient.upload('/validations/upload', formData);
  },

  cancelValidation: async (id) => {
    return apiClient.put(`/validations/${id}/cancel`);
  },

  downloadCertificate: async (id) => {
    return apiClient.get(`/validations/${id}/certificate`, { responseType: 'blob' });
  },

  getValidationErrors: async (id) => {
    return apiClient.get(`/validations/${id}/errors`);
  },

  getDocumentStructure: async (id) => {
    return apiClient.get(`/validations/${id}/structure`);
  },
};
