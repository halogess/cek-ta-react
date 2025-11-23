import apiClient from './client';

export const dokumenService = {
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
    
    if (params.limit) backendParams.limit = params.limit;
    if (params.offset !== undefined) backendParams.offset = params.offset;
    
    return apiClient.get('/dokumen', { params: backendParams });
  },

  canUpload: async () => {
    return apiClient.get('/dokumen/can-upload');
  },

  getDokumenStats: async () => {
    return apiClient.get('/dokumen/stats');
  },

  uploadDokumen: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.upload('/dokumen', formData);
  },

  cancelDokumen: async (id) => {
    return apiClient.patch(`/dokumen/${id}/batal`);
  },
};
