/**
 * Dashboard Controller - Backend Logic Simulation
 * Semua logika bisnis untuk dashboard stats
 */

import { mockUsers, mockValidations, mockBookValidations } from '../data/mockData';

export const dashboardController = {
  /**
   * Get admin stats dengan kalkulasi
   */
  getAdminStats: () => {
    const all = [...mockValidations, ...mockBookValidations];
    
    const usersByProdi = mockUsers.reduce((acc, user) => {
      acc[user.jurusan] = (acc[user.jurusan] || 0) + 1;
      return acc;
    }, {});
    
    return {
      total: all.length,
      waiting: all.filter(v => v.status === 'Dalam Antrian' || v.status === 'Diproses').length,
      passed: all.filter(v => v.status === 'Lolos').length,
      needsFix: all.filter(v => v.status === 'Tidak Lolos').length,
      usersByProdi
    };
  },

  /**
   * Get mahasiswa dashboard dengan stats dan history
   */
  getMahasiswaDashboard: (userId) => {
    const dokumenData = mockValidations
      .filter(v => v.nrp === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const bukuData = mockBookValidations
      .filter(v => v.nrp === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const judulBuku = bukuData.length > 0 ? bukuData[0].judulBuku : '';
    
    return {
      dokumen: {
        stats: {
          total: dokumenData.length,
          waiting: dokumenData.filter(v => v.status === 'Dalam Antrian' || v.status === 'Diproses').length,
          passed: dokumenData.filter(v => v.status === 'Lolos').length,
          needsFix: dokumenData.filter(v => v.status === 'Tidak Lolos').length,
          cancelled: dokumenData.filter(v => v.status === 'Dibatalkan').length
        },
        history: dokumenData.slice(0, 3)
      },
      buku: {
        stats: {
          total: bukuData.length,
          waiting: bukuData.filter(v => v.status === 'Dalam Antrian' || v.status === 'Diproses').length,
          passed: bukuData.filter(v => v.status === 'Lolos').length,
          needsFix: bukuData.filter(v => v.status === 'Tidak Lolos').length,
          cancelled: bukuData.filter(v => v.status === 'Dibatalkan').length
        },
        history: bukuData.slice(0, 3)
      },
      judulBuku
    };
  },

  /**
   * Get error statistics untuk chart
   */
  getErrorStatistics: () => {
    return [
      { name: 'Format Font', count: 234, percentage: 35 },
      { name: 'Spasi Paragraf', count: 189, percentage: 28 },
      { name: 'Margin Halaman', count: 156, percentage: 23 },
      { name: 'Penomoran', count: 94, percentage: 14 }
    ];
  },

  /**
   * Get system info
   */
  getSystemInfo: () => {
    return {
      todayValidations: 47,
      avgTime: 3.2,
      successRate: 71.5
    };
  },
};
