/**
 * Validation Controller - Backend Logic Simulation
 * Semua logika bisnis untuk validasi dokumen dan buku
 */

import { mockValidations, mockBookValidations, getValidationById as getValidationByIdFromData, getBookValidationById, mockUsers } from '../data/mockData';
import { documentStructure, bookDocumentStructure, errors, bookErrors } from '../data/validationData';

export const validationController = {
  /**
   * Get all validations dengan filtering dan sorting
   */
  getAllValidations: (params = {}) => {
    let data = [...mockValidations, ...mockBookValidations].filter(v => v.status !== 'Dibatalkan');
    
    if (params.status && params.status !== 'Semua') {
      if (params.status === 'Menunggu') {
        data = data.filter(v => v.status === 'Dalam Antrian' || v.status === 'Diproses');
      } else {
        data = data.filter(v => v.status === params.status);
      }
    }
    
    if (params.prodi && params.prodi !== 'Semua') {
      data = data.filter(v => v.jurusan === params.prodi);
    }
    
    if (params.startDate) {
      data = data.filter(v => new Date(v.date) >= new Date(params.startDate));
    }
    
    if (params.endDate) {
      data = data.filter(v => new Date(v.date) <= new Date(params.endDate));
    }
    
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      data = data.filter(v => 
        v.nama?.toLowerCase().includes(searchLower) ||
        v.nrp?.toLowerCase().includes(searchLower) ||
        v.filename?.toLowerCase().includes(searchLower)
      );
    }
    
    if (params.sort === 'terbaru') {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (params.sort === 'terlama') {
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    return data;
  },

  /**
   * Get validations by user dengan filtering dan sorting
   */
  getValidationsByUser: (userId, params = {}) => {
    let data = mockValidations.filter(v => v.nrp === userId);
    
    // Map frontend status to backend format
    const statusMap = {
      'Dibatalkan': 'dibatalkan',
      'Dalam Antrian': 'dalam_antrian',
      'Diproses': 'diproses',
      'Lolos': 'lolos',
      'Tidak Lolos': 'tidak_lolos'
    };
    
    if (params.status && params.status !== 'Semua') {
      if (params.status === 'Menunggu') {
        data = data.filter(v => v.status === 'Dalam Antrian' || v.status === 'Diproses');
      } else {
        data = data.filter(v => v.status === params.status);
      }
    }
    
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      data = data.filter(v => v.filename?.toLowerCase().includes(searchLower));
    }
    
    // Map sort to backend format (asc/desc)
    const sortOrder = params.sort === 'terlama' ? 'asc' : 'desc';
    if (sortOrder === 'desc') {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    const total = data.length;
    
    // Apply pagination
    const limit = params.limit || 10;
    const offset = params.offset || 0;
    data = data.slice(offset, offset + limit);
    
    // Transform to backend format
    return {
      data: data.map(v => ({
        id: v.id,
        filename: v.filename,
        tanggal_upload: v.date,
        ukuran_file: parseFloat(v.size) * 1024 * 1024,
        status: statusMap[v.status] || v.status.toLowerCase(),
        jumlah_kesalahan: v.errorCount
      })),
      total: total,
      limit: limit,
      offset: offset
    };
  },

  /**
   * Get book validations dengan filtering dan sorting
   */
  getAllBookValidations: (params = {}) => {
    let data = mockBookValidations.filter(v => v.status !== 'Dibatalkan');
    
    if (params.status && params.status !== 'Semua') {
      if (params.status === 'Menunggu') {
        data = data.filter(v => v.status === 'Dalam Antrian' || v.status === 'Diproses');
      } else {
        data = data.filter(v => v.status === params.status);
      }
    }
    
    if (params.prodi && params.prodi !== 'Semua') {
      data = data.filter(v => v.jurusan === params.prodi);
    }
    
    if (params.startDate) {
      data = data.filter(v => new Date(v.date) >= new Date(params.startDate));
    }
    
    if (params.endDate) {
      data = data.filter(v => new Date(v.date) <= new Date(params.endDate));
    }
    
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      data = data.filter(v => 
        v.nama?.toLowerCase().includes(searchLower) ||
        v.nrp?.toLowerCase().includes(searchLower) ||
        v.judulBuku?.toLowerCase().includes(searchLower)
      );
    }
    
    if (params.sort === 'terbaru') {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (params.sort === 'terlama') {
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    return data;
  },

  /**
   * Get all book validations for admin (API format)
   */
  getAllBookValidationsAPI: (params = {}) => {
    let data = mockBookValidations;
    
    const statusMap = {
      'Dibatalkan': 'dibatalkan',
      'Dalam Antrian': 'dalam_antrian',
      'Diproses': 'diproses',
      'Lolos': 'lolos',
      'Tidak Lolos': 'tidak_lolos'
    };
    
    if (params.status) {
      const statuses = params.status.split(',');
      data = data.filter(v => statuses.includes(statusMap[v.status]));
    }
    
    const sortOrder = params.sort || 'desc';
    if (sortOrder === 'desc') {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    const total = data.length;
    const limit = params.limit || 10;
    const offset = params.offset || 0;
    data = data.slice(offset, offset + limit);
    
    return {
      data: data.map(v => ({
        id: v.id,
        judul: v.judulBuku,
        tanggal_upload: v.date,
        jumlah_bab: v.numChapters,
        status: statusMap[v.status],
        skor: v.skor,
        jumlah_kesalahan: v.errorCount,
        nrp: v.nrp,
        nama: v.nama,
        jurusan: v.jurusan
      })),
      total,
      limit,
      offset
    };
  },

  /**
   * Get book validations by user dengan filtering dan sorting (API format)
   */
  getBookValidationsByUserAPI: (userId, params = {}) => {
    let data = mockBookValidations.filter(v => v.nrp === userId);
    
    const statusMap = {
      'Dibatalkan': 'dibatalkan',
      'Dalam Antrian': 'dalam_antrian',
      'Diproses': 'diproses',
      'Lolos': 'lolos',
      'Tidak Lolos': 'tidak_lolos'
    };
    
    if (params.status) {
      const statuses = params.status.split(',');
      data = data.filter(v => statuses.includes(statusMap[v.status]));
    }
    
    const sortOrder = params.sort || 'desc';
    if (sortOrder === 'desc') {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    const total = data.length;
    const limit = params.limit || 10;
    const offset = params.offset || 0;
    data = data.slice(offset, offset + limit);
    
    return {
      data: data.map(v => ({
        id: v.id,
        judul: v.judulBuku,
        tanggal_upload: v.date,
        jumlah_bab: v.numChapters,
        status: statusMap[v.status],
        skor: v.skor,
        jumlah_kesalahan: v.errorCount
      })),
      total,
      limit,
      offset
    };
  },

  /**
   * Get buku stats by user
   */
  getBukuStats: (userId) => {
    const userBooks = mockBookValidations.filter(v => v.nrp === userId);
    return {
      total: userBooks.filter(v => v.status !== 'Dibatalkan').length,
      dalam_antrian: userBooks.filter(v => v.status === 'Dalam Antrian').length,
      diproses: userBooks.filter(v => v.status === 'Diproses').length,
      selesai_convert: 0,
      lolos: userBooks.filter(v => v.status === 'Lolos').length,
      tidak_lolos: userBooks.filter(v => v.status === 'Tidak Lolos').length
    };
  },

  /**
   * Get buku stats for admin (all books)
   */
  getBukuStatsAdmin: () => {
    const dalamAntrian = mockBookValidations.filter(v => v.status === 'Dalam Antrian').length;
    const diproses = mockBookValidations.filter(v => v.status === 'Diproses').length;
    const selesaiConvert = 0;
    
    return {
      total: mockBookValidations.filter(v => v.status !== 'Dibatalkan').length,
      dalam_antrian: dalamAntrian,
      diproses: diproses,
      selesai_convert: selesaiConvert,
      lolos: mockBookValidations.filter(v => v.status === 'Lolos').length,
      tidak_lolos: mockBookValidations.filter(v => v.status === 'Tidak Lolos').length,
      menunggu_validasi: dalamAntrian + diproses + selesaiConvert
    };
  },

  /**
   * Check if user can upload book
   */
  canUploadBook: (userId) => {
    const userBooks = mockBookValidations.filter(v => v.nrp === userId);
    const hasPending = userBooks.some(v => v.status === 'Dalam Antrian' || v.status === 'Diproses');
    return { can_upload: !hasPending };
  },

  /**
   * Get validation by ID
   */
  getValidationById: (id) => {
    return getBookValidationById(parseInt(id)) || getValidationByIdFromData(parseInt(id));
  },

  /**
   * Get validation errors by ID
   */
  getValidationErrors: (id) => {
    const validation = getBookValidationById(parseInt(id)) || getValidationByIdFromData(parseInt(id));
    const errorList = validation?.type === 'book' ? bookErrors : errors;
    const errorCount = validation?.errorCount || 0;
    return errorList.slice(0, errorCount);
  },

  /**
   * Get document structure by ID
   */
  getDocumentStructure: (id) => {
    const validation = getBookValidationById(parseInt(id)) || getValidationByIdFromData(parseInt(id));
    return validation?.type === 'book' ? bookDocumentStructure : documentStructure;
  },

  /**
   * Get recommendations by ID (generate based on errors)
   */
  getRecommendations: (id) => {
    const validation = getBookValidationById(parseInt(id)) || getValidationByIdFromData(parseInt(id));
    const errorList = validation?.type === 'book' ? bookErrors : errors;
    const errorCount = validation?.errorCount || 0;
    const validationErrors = errorList.slice(0, errorCount);
    
    // Generate recommendations based on error categories
    const recommendations = [];
    const categories = [...new Set(validationErrors.map(e => e.category))];
    
    if (categories.includes('Font')) {
      recommendations.push({
        title: 'Konsistensi Font',
        description: 'Gunakan fitur Styles di Microsoft Word untuk memastikan konsistensi font di seluruh dokumen.',
        priority: 'Tinggi'
      });
    }
    
    if (categories.includes('Spasi')) {
      recommendations.push({
        title: 'Pengaturan Spasi',
        description: 'Buat Style khusus dengan line spacing 1.5 untuk paragraf body text agar konsisten.',
        priority: 'Sedang'
      });
    }
    
    if (categories.includes('Margin')) {
      recommendations.push({
        title: 'Periksa Section Breaks',
        description: 'Gunakan Show/Hide (Ctrl+Shift+8) untuk melihat section breaks yang mungkin mempengaruhi margin.',
        priority: 'Tinggi'
      });
    }
    
    if (categories.includes('Referensi')) {
      recommendations.push({
        title: 'Gunakan Reference Manager',
        description: 'Pertimbangkan menggunakan Mendeley, Zotero, atau EndNote untuk mengelola referensi secara otomatis.',
        priority: 'Tinggi'
      });
    }
    
    if (categories.includes('Gambar') || categories.includes('Tabel')) {
      recommendations.push({
        title: 'Caption Otomatis',
        description: 'Gunakan fitur Insert Caption untuk penomoran gambar dan tabel yang otomatis update.',
        priority: 'Sedang'
      });
    }
    
    // General recommendation
    recommendations.push({
      title: 'Backup Dokumen',
      description: 'Selalu simpan backup dokumen sebelum melakukan perubahan besar.',
      priority: 'Rendah'
    });
    
    return recommendations;
  },

  /**
   * Check if user can upload (no pending validations)
   */
  canUpload: (userId) => {
    const userValidations = mockValidations.filter(v => v.nrp === userId);
    const hasPending = userValidations.some(v => v.status === 'Dalam Antrian' || v.status === 'Diproses');
    
    return {
      can_upload: !hasPending,
      reason: hasPending ? 'Anda masih memiliki dokumen yang sedang diproses atau dalam antrian' : null
    };
  },

  /**
   * Upload document (simulate)
   */
  uploadDocument: (file, metadata) => {
    if (!file) {
      const error = new Error('File tidak boleh kosong');
      error.status = 400;
      error.data = { message: 'File tidak boleh kosong' };
      throw error;
    }

    if (!file.name.endsWith('.docx')) {
      const error = new Error('Ekstensi file tidak diizinkan. Hanya .docx yang diperbolehkan.');
      error.status = 400;
      error.data = { message: 'Ekstensi file tidak diizinkan. Hanya .docx yang diperbolehkan.' };
      throw error;
    }

    // Get NRP from localStorage
    const nrp = localStorage.getItem('user_nrp');
    
    // Check if user exists in mock data
    if (nrp) {
      const user = mockUsers.find(u => u.nrp === nrp);
      if (!user) {
        const error = new Error('NRP tidak ditemukan');
        error.status = 401;
        error.data = { message: 'NRP tidak ditemukan' };
        throw error;
      }
    }

    return {
      message: 'Dokumen berhasil diupload',
      dokumen_id: Date.now(),
    };
  },

  /**
   * Upload book (simulate)
   */
  uploadBook: (files, metadata) => {
    return {
      id: Date.now(),
      status: 'Dalam Antrian',
      message: 'Book uploaded successfully',
      type: 'book'
    };
  },

  /**
   * Cancel validation (simulate)
   */
  cancelValidation: (id) => {
    return { message: 'Validation cancelled' };
  },

  /**
   * Download certificate (simulate)
   */
  downloadCertificate: (id) => {
    return new Blob(['Mock Certificate PDF'], { type: 'application/pdf' });
  },

  /**
   * Get document preview data (simulate)
   */
  getDocumentPreview: (id, errorIndex) => {
    // Simulate document preview with error highlighting
    return {
      pageNumber: Math.floor(errorIndex / 3) + 1,
      previewUrl: `/preview/${id}/page-${Math.floor(errorIndex / 3) + 1}.png`,
      highlightArea: {
        x: 100 + (errorIndex % 3) * 50,
        y: 150 + (errorIndex % 5) * 40,
        width: 200,
        height: 30
      }
    };
  },
};
