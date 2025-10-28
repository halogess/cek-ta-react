import apiClient from './client';

export const templateService = {
  getAllTemplates: async () => {
    return apiClient.get('/templates');
  },

  getTemplateById: async (id) => {
    return apiClient.get(`/templates/${id}`);
  },

  uploadTemplate: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.upload('/templates/upload', formData);
  },

  updateTemplate: async (id, data) => {
    return apiClient.put(`/templates/${id}`, data);
  },

  deleteTemplate: async (id) => {
    return apiClient.delete(`/templates/${id}`);
  },

  activateTemplate: async (id) => {
    return apiClient.put(`/templates/${id}/activate`);
  },

  updateFormatRules: async (id, rules) => {
    return apiClient.put(`/templates/${id}/rules`, rules);
  },

  getActiveTemplate: async () => {
    return apiClient.get('/templates/active');
  },

  downloadTemplate: async (id) => {
    return apiClient.get(`/templates/${id}/download`, { responseType: 'blob' });
  },
};
