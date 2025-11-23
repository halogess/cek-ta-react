import apiClient from './client';

export const bukuService = {
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

  getAllBookValidations: async (params = {}) => {
    return apiClient.get('/buku', { params });
  },

  getBukuStats: async () => {
    return apiClient.get('/buku/stats');
  },

  getBukuStatsAdmin: async (nrp = null) => {
    const params = nrp ? { nrp } : {};
    return apiClient.get('/buku/stats', { params });
  },

  getBukuJudul: async () => {
    return apiClient.get('/buku/judul');
  },

  canUploadBook: async () => {
    return apiClient.get('/buku/can-upload');
  },

  uploadBook: async (files, judul) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('judul', judul);
    return apiClient.upload('/buku', formData);
  },

  cancelBuku: async (id) => {
    return apiClient.patch(`/buku/${id}/batal`);
  },

  /**
   * Get buku mahasiswa yang sudah yudisium (lolos)
   * @param {object} params - { jurusan, status, limit, offset }
   * @returns {Promise} { data: [{ nrp, nama, jurusan, total_buku, buku }], total, limit, offset }
   */
  getBukuLulus: async (params = {}) => {
    return apiClient.get('/buku/lulus', { params });
  },
};
