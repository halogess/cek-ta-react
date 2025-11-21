/**
 * Mock API Client - Simulasi backend API untuk development
 * Menggunakan backend controllers untuk semua logika bisnis
 * 
 * Digunakan saat VITE_USE_MOCK=true
 */

import { 
  validationController, 
  dashboardController, 
  templateController, 
  authController, 
  settingsController, 
  userController 
} from '../../backend';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const mockApiClient = {
  get: async (endpoint, options = {}) => {
    console.log('🔵 Mock GET:', endpoint, options.params);
    await delay();
    
    if (endpoint === '/buku/stats') {
      const nrp = options.params?.nrp;
      const stats = {
        total: 50,
        dalam_antrian: 10,
        diproses: 5,
        selesai_convert: 15,
        lolos: 18,
        tidak_lolos: 2,
        menunggu_validasi: 30
      };
      
      if (nrp) {
        return {
          total: 5,
          dalam_antrian: 1,
          diproses: 0,
          selesai_convert: 2,
          lolos: 2,
          tidak_lolos: 0,
          menunggu_validasi: 3
        };
      }
      
      return stats;
    }
    
    if (endpoint === '/buku') {
      const { status, sort = 'desc', limit = 10, offset = 0, nrp, search, jurusan, startDate, endDate } = options.params || {};
      
      console.log('🔵 Mock /buku params:', options.params);
      
      const mockData = [
        {
          id: 1,
          judul: 'Implementasi Machine Learning untuk Prediksi',
          nrp: '222117032',
          nama: 'Ahmad Ridwan',
          jurusan: 'IF',
          tanggal_upload: '2024-01-15T10:00:00',
          jumlah_bab: 5,
          status: 'lolos',
          skor: 85,
          jumlah_kesalahan: 3
        },
        {
          id: 2,
          judul: 'Sistem Informasi Berbasis Web',
          nrp: '222117033',
          nama: 'Siti Nurhaliza',
          jurusan: 'SI',
          tanggal_upload: '2024-01-14T09:00:00',
          jumlah_bab: 4,
          status: 'dalam_antrian',
          skor: null,
          jumlah_kesalahan: null
        },
        {
          id: 3,
          judul: 'Analisis Data Mining',
          nrp: '222117034',
          nama: 'Budi Santoso',
          jurusan: 'IF',
          tanggal_upload: '2024-01-13T08:00:00',
          jumlah_bab: 6,
          status: 'tidak_lolos',
          skor: 65,
          jumlah_kesalahan: 15
        },
        {
          id: 4,
          judul: 'Sistem Pakar Diagnosa Penyakit',
          nrp: '222117035',
          nama: 'Dewi Lestari',
          jurusan: 'TI',
          tanggal_upload: '2024-01-12T14:00:00',
          jumlah_bab: 5,
          status: 'diproses',
          skor: null,
          jumlah_kesalahan: null
        },
        {
          id: 5,
          judul: 'Aplikasi Mobile Jessica',
          nrp: '222117',
          nama: 'Jessica Admin',
          jurusan: 'SI',
          tanggal_upload: '2025-11-15T10:00:00',
          jumlah_bab: 5,
          status: 'lolos',
          skor: 90,
          jumlah_kesalahan: 2
        }
      ];
      
      let filtered = mockData;
      
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(b => 
          b.nama?.toLowerCase().includes(searchLower) ||
          b.nrp?.toLowerCase().includes(searchLower) ||
          b.judul?.toLowerCase().includes(searchLower)
        );
      }
      
      if (jurusan) {
        filtered = filtered.filter(b => b.jurusan === jurusan);
      }
      
      if (status) {
        const statuses = status.split(',');
        filtered = filtered.filter(b => statuses.includes(b.status));
      }
      
      if (startDate) {
        filtered = filtered.filter(b => new Date(b.tanggal_upload) >= new Date(startDate));
      }
      
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filtered = filtered.filter(b => new Date(b.tanggal_upload) <= end);
      }
      
      if (nrp) {
        filtered = filtered.filter(b => b.nrp === nrp);
      }
      
      if (sort === 'asc') {
        filtered.sort((a, b) => new Date(a.tanggal_upload) - new Date(b.tanggal_upload));
      } else {
        filtered.sort((a, b) => new Date(b.tanggal_upload) - new Date(a.tanggal_upload));
      }
      
      return {
        data: filtered.slice(offset, offset + limit),
        total: filtered.length,
        limit,
        offset
      };
    }
    
    if (endpoint === '/validations/books') {
      return validationController.getAllBookValidations(options.params);
    }
    

    
    if (endpoint === '/dokumen/can-upload') {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      return validationController.canUpload(userData.username);
    }
    
    if (endpoint === '/buku/can-upload') {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      return validationController.canUploadBook(userData.username);
    }
    
    if (endpoint === '/buku/stats') {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      return validationController.getBukuStats(userData.username);
    }
    
    if (endpoint === '/buku') {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      if (userData.role === 'admin') {
        return validationController.getAllBookValidationsAPI(options.params);
      }
      return validationController.getBookValidationsByUserAPI(userData.username, options.params);
    }
    
    if (endpoint === '/buku/stats') {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      if (userData.role === 'admin') {
        return validationController.getBukuStatsAdmin();
      }
      return validationController.getBukuStats(userData.username);
    }
    
    if (endpoint === '/dokumen/stats') {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      return dashboardController.getDocumentStats(userData.username);
    }
    
    if (endpoint === '/dokumen') {
      return validationController.getValidationsByUser(null, options.params);
    }
    
    if (endpoint.startsWith('/validations/user/')) {
      const userId = endpoint.split('/').pop();
      return validationController.getValidationsByUser(userId, options.params);
    }
    
    if (endpoint.startsWith('/validations/') && endpoint.includes('/certificate')) {
      if (options.responseType === 'blob') {
        return validationController.downloadCertificate(parseInt(endpoint.split('/')[2]));
      }
      return { url: '/certificate.pdf' };
    }
    
    if (endpoint.startsWith('/validations/') && endpoint.includes('/errors')) {
      const id = parseInt(endpoint.split('/')[2]);
      return validationController.getValidationErrors(id);
    }
    
    if (endpoint.startsWith('/validations/') && endpoint.includes('/structure')) {
      const id = parseInt(endpoint.split('/')[2]);
      return validationController.getDocumentStructure(id);
    }
    
    if (endpoint.startsWith('/validations/') && endpoint.includes('/recommendations')) {
      const id = parseInt(endpoint.split('/')[2]);
      return validationController.getRecommendations(id);
    }
    
    if (endpoint.startsWith('/validations/') && endpoint.includes('/preview')) {
      const pathParts = endpoint.split('/');
      const id = parseInt(pathParts[2]);
      const errorIndex = parseInt(pathParts[4]) || 0;
      return validationController.getDocumentPreview(id, errorIndex);
    }
    
    if (endpoint.startsWith('/validations/')) {
      const id = endpoint.split('/')[2];
      return validationController.getValidationById(parseInt(id));
    }
    
    if (endpoint.startsWith('/validations')) {
      return validationController.getAllValidations(options.params);
    }
    
    if (endpoint.startsWith('/users/nrp/')) {
      const nrp = endpoint.split('/').pop();
      return userController.getUserByNrp(nrp);
    }
    
    if (endpoint === '/settings/min-score') {
      return settingsController.getMinScore();
    }
    
    if (endpoint === '/templates/active') {
      return templateController.getActiveTemplate();
    }
    
    if (endpoint === '/templates') {
      return templateController.getAllTemplates();
    }
    
    if (endpoint.startsWith('/templates/') && endpoint.includes('/download')) {
      if (options.responseType === 'blob') {
        return templateController.downloadTemplate(parseInt(endpoint.split('/')[2]));
      }
      return { url: '/template.docx' };
    }
    
    if (endpoint === '/dashboard/admin/stats') {
      return dashboardController.getAdminStats();
    }
    
    if (endpoint.startsWith('/dashboard/mahasiswa/')) {
      const pathParts = endpoint.split('/');
      const userId = pathParts[3];
      
      if (pathParts.length === 4 || (pathParts.length === 5 && pathParts[4] === '')) {
        return dashboardController.getMahasiswaDashboard(userId);
      }
    }
    
    if (endpoint === '/dashboard/admin/error-stats') {
      return dashboardController.getErrorStatistics();
    }
    
    if (endpoint === '/dashboard/admin/system-info') {
      return dashboardController.getSystemInfo();
    }
    
    if (endpoint === '/jurusan') {
      return [
        { kode: 'IF', nama: 'Teknik Informatika' },
        { kode: 'SI', nama: 'Sistem Informasi' },
        { kode: 'TI', nama: 'Teknik Industri' }
      ];
    }
    
    if (endpoint.startsWith('/users/')) {
      const userId = endpoint.split('/').pop();
      return userController.getUserByNrp(userId);
    }
    
    throw new Error('Endpoint not found');
  },

  post: async (endpoint, data) => {
    console.log('🔵 Mock POST:', endpoint, data);
    await delay();
    
    if (endpoint === '/auth/login') {
      const { username, password } = data;
      return authController.login(username, password);
    }
    
    if (endpoint === '/auth/logout') {
      return authController.logout();
    }
    
    if (endpoint === '/auth/refresh') {
      return authController.refreshToken();
    }
    
    throw new Error('Endpoint not found');
  },

  put: async (endpoint, data) => {
    console.log('🔵 Mock PUT:', endpoint, data);
    await delay();
    
    if (endpoint.includes('/cancel')) {
      return validationController.cancelValidation(parseInt(endpoint.split('/')[2]));
    }
    
    if (endpoint === '/settings/min-score') {
      return settingsController.updateMinScore(data.score);
    }
    
    if (endpoint.includes('/activate')) {
      return templateController.activateTemplate(parseInt(endpoint.split('/')[2]));
    }
    
    if (endpoint.includes('/rules')) {
      return templateController.updateRules(parseInt(endpoint.split('/')[2]), data);
    }
    
    if (endpoint.startsWith('/templates/')) {
      return templateController.updateTemplate(parseInt(endpoint.split('/')[2]), data);
    }
    
    throw new Error('Endpoint not found');
  },

  delete: async (endpoint) => {
    console.log('🔵 Mock DELETE:', endpoint);
    await delay();
    return templateController.deleteTemplate(parseInt(endpoint.split('/')[2]));
  },

  patch: async (endpoint, data) => {
    console.log('🔵 Mock PATCH:', endpoint, data);
    await delay();
    
    if (endpoint.includes('/cancel')) {
      return validationController.cancelValidation(parseInt(endpoint.split('/')[2]));
    }
    
    throw new Error('Endpoint not found');
  },

  upload: async (endpoint, formData) => {
    console.log('🔵 Mock UPLOAD:', endpoint, {
      file: formData.get('file')?.name,
      metadata: formData.get('metadata'),
    });
    await delay(1000);
    
    if (endpoint === '/dokumen') {
      return validationController.uploadDocument(formData.get('file'));
    }
    
    if (endpoint === '/validations/upload') {
      return validationController.uploadDocument(formData.get('file'), JSON.parse(formData.get('metadata')));
    }
    
    if (endpoint === '/validations/upload-book') {
      return validationController.uploadBook(formData.getAll('files'), JSON.parse(formData.get('metadata')));
    }
    
    if (endpoint === '/buku') {
      const files = formData.getAll('files');
      const judul = formData.get('judul');
      
      if (!judul) {
        const error = new Error('Judul tidak boleh kosong');
        error.status = 400;
        error.data = { message: 'Judul tidak boleh kosong' };
        throw error;
      }
      if (!files || files.length === 0) {
        const error = new Error('File tidak boleh kosong');
        error.status = 400;
        error.data = { message: 'File tidak boleh kosong' };
        throw error;
      }
      
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      const canUploadResult = validationController.canUploadBook(userData.username);
      if (!canUploadResult.can_upload) {
        const error = new Error('Masih ada buku dalam antrian');
        error.status = 400;
        error.data = { message: 'Masih ada buku dalam antrian' };
        throw error;
      }
      
      return { message: 'Buku berhasil diupload', buku_id: Date.now() };
    }
    
    if (endpoint === '/templates/upload') {
      return templateController.uploadTemplate(formData);
    }
    
    throw new Error('Endpoint not found');
  },
};

export default mockApiClient;
