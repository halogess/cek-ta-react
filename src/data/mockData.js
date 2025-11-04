/**
 * Mock Data - Data dummy untuk development dan testing
 * Berisi data users, validations, dan helper functions
 * Digunakan oleh mockClient.js saat VITE_USE_MOCK=true
 */

// Data mahasiswa untuk testing
export const mockUsers = [
  {
    id: 1,
    nrp: '5025201001',
    nama: 'Ahmad Ridwan',
    jurusan: 'Teknik Informatika',
    email: 'ahmad.ridwan@student.its.ac.id'
  },
  {
    id: 2,
    nrp: '5025201002',
    nama: 'Siti Nurhaliza',
    jurusan: 'Sistem Informasi',
    email: 'siti.nurhaliza@student.its.ac.id'
  },
  {
    id: 3,
    nrp: '5025201003',
    nama: 'Budi Santoso',
    jurusan: 'Teknik Informatika',
    email: 'budi.santoso@student.its.ac.id'
  },
  {
    id: 4,
    nrp: '5025201004',
    nama: 'Dewi Lestari',
    jurusan: 'Sistem Informasi',
    email: 'dewi.lestari@student.its.ac.id'
  },
  {
    id: 5,
    nrp: '5025201005',
    nama: 'Eko Prasetyo',
    jurusan: 'Teknik Industri',
    email: 'eko.prasetyo@student.its.ac.id'
  },
  {
    id: 6,
    nrp: '5025201006',
    nama: 'Rina Wijaya',
    jurusan: 'Teknik Elektro',
    email: 'rina.wijaya@student.its.ac.id'
  },
  {
    id: 7,
    nrp: '5025201007',
    nama: 'Fajar Nugroho',
    jurusan: 'DKV',
    email: 'fajar.nugroho@student.its.ac.id'
  },
  {
    id: 8,
    nrp: '5025201008',
    nama: 'Maya Sari',
    jurusan: 'Desain Produk',
    email: 'maya.sari@student.its.ac.id'
  }
];

// Helper function untuk generate data validasi dokumen
const generateDocValidations = () => {
  const statuses = ['Lolos', 'Tidak Lolos', 'Dibatalkan'];
  const users = mockUsers.map(u => ({ id: u.id, nrp: u.nrp, nama: u.nama, jurusan: u.jurusan, judul: u.email.split('@')[0] }));
  
  const generateDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };
  
  const validations = [];
  let diprosesAdded = false;
  const usersWithQueue = [0, 1, 2, 3]; // User index yang punya antrian
  
  users.forEach((user, userIndex) => {
    let hasQueueForUser = false;
    
    for (let i = 0; i < 20; i++) {
      let status;
      
      if (!diprosesAdded && userIndex === 0 && i === 0) {
        status = 'Diproses';
        diprosesAdded = true;
        hasQueueForUser = true;
      } else if (!hasQueueForUser && usersWithQueue.includes(userIndex) && i === 1) {
        status = 'Dalam Antrian';
        hasQueueForUser = true;
      } else {
        status = statuses[i % 3];
      }
      
      validations.push({
        id: userIndex * 20 + i + 1,
        userId: user.id,
        nrp: user.nrp,
        nama: user.nama,
        jurusan: user.jurusan,
        judulTA: user.judul,
        filename: `Dokumen_${i + 1}_${user.nama.split(' ')[0]}.docx`,
        date: generateDate(i * 2 + userIndex),
        size: `${(1.5 + Math.random() * 2).toFixed(1)} MB`,
        status: status,
        statusColor: status === 'Lolos' ? 'success' : status === 'Tidak Lolos' ? 'error' : status === 'Dalam Antrian' ? 'info' : status === 'Diproses' ? 'warning' : 'default',
        errorCount: status === 'Tidak Lolos' ? Math.floor(Math.random() * 10) + 1 : (status === 'Dalam Antrian' || status === 'Diproses') ? null : 0,
        skor: status === 'Lolos' ? Math.floor(Math.random() * 20) + 80 : status === 'Tidak Lolos' ? Math.floor(Math.random() * 30) + 40 : null,
        isPassedValidation: status === 'Lolos',
        queuePosition: status === 'Dalam Antrian' ? Math.floor(Math.random() * 5) + 2 : status === 'Diproses' ? 1 : 0
      });
    }
  });
  return validations;
};

export const mockValidations = generateDocValidations();

// Keep old data for reference
const oldMockValidations = [
  // Ahmad Ridwan (5025201001) - 5 riwayat
  {
    id: 1,
    userId: 1,
    nrp: '5025201001',
    nama: 'Ahmad Ridwan',
    jurusan: 'Teknik Informatika',
    judulTA: 'Implementasi Machine Learning untuk Prediksi Cuaca',
    filename: 'Proposal_TA_2024.docx',
    date: '2024-01-20',
    size: '2.4 MB',
    status: 'Dalam Antrian',
    statusColor: 'info',
    errorCount: null,
    skor: null,
    isPassedValidation: false,
    queuePosition: 3
  },
  {
    id: 2,
    userId: 1,
    nrp: '5025201001',
    nama: 'Ahmad Ridwan',
    jurusan: 'Teknik Informatika',
    judulTA: 'Implementasi Machine Learning untuk Prediksi Cuaca',
    filename: 'BAB_1_Pendahuluan.docx',
    date: '2024-01-15',
    size: '1.5 MB',
    status: 'Tidak Lolos',
    statusColor: 'error',
    errorCount: 8,
    skor: 48,
    isPassedValidation: false,
    queuePosition: 0
  },
  {
    id: 3,
    userId: 1,
    nrp: '5025201001',
    nama: 'Ahmad Ridwan',
    jurusan: 'Teknik Informatika',
    judulTA: 'Implementasi Machine Learning untuk Prediksi Cuaca',
    filename: 'Lampiran_Data.docx',
    date: '2024-01-10',
    size: '3.5 MB',
    status: 'Tidak Lolos',
    statusColor: 'error',
    errorCount: 6,
    skor: 58,
    isPassedValidation: false,
    queuePosition: 0
  },
  {
    id: 4,
    userId: 1,
    nrp: '5025201001',
    nama: 'Ahmad Ridwan',
    jurusan: 'Teknik Informatika',
    judulTA: 'Implementasi Machine Learning untuk Prediksi Cuaca',
    filename: 'BAB_2_Tinjauan_Pustaka.docx',
    date: '2024-01-08',
    size: '2.1 MB',
    status: 'Lolos',
    statusColor: 'success',
    errorCount: 0,
    skor: 100,
    isPassedValidation: true,
    queuePosition: 0
  },
  {
    id: 5,
    userId: 1,
    nrp: '5025201001',
    nama: 'Ahmad Ridwan',
    jurusan: 'Teknik Informatika',
    judulTA: 'Implementasi Machine Learning untuk Prediksi Cuaca',
    filename: 'Draft_Awal.docx',
    date: '2024-01-05',
    size: '1.8 MB',
    status: 'Dibatalkan',
    statusColor: 'default',
    errorCount: null,
    skor: null,
    isPassedValidation: false,
    queuePosition: 0
  },
  // Siti Nurhaliza (5025201002) - 5 riwayat
  {
    id: 6,
    userId: 2,
    nrp: '5025201002',
    nama: 'Siti Nurhaliza',
    jurusan: 'Sistem Informasi',
    judulTA: 'Sistem Informasi Manajemen Perpustakaan Berbasis Web',
    filename: 'Tesis_Siti_Nurhaliza_V2.docx',
    date: '2024-01-19',
    size: '3.1 MB',
    status: 'Tidak Lolos',
    statusColor: 'error',
    errorCount: 5,
    skor: 65,
    isPassedValidation: false,
    queuePosition: 0
  },
  {
    id: 7,
    userId: 2,
    nrp: '5025201002',
    nama: 'Siti Nurhaliza',
    jurusan: 'Sistem Informasi',
    judulTA: 'Sistem Informasi Manajemen Perpustakaan Berbasis Web',
    filename: 'BAB_2_Tinjauan_Pustaka.docx',
    date: '2024-01-14',
    size: '2.2 MB',
    status: 'Diproses',
    statusColor: 'warning',
    errorCount: null,
    skor: null,
    isPassedValidation: false,
    queuePosition: 0
  },
  {
    id: 8,
    userId: 2,
    nrp: '5025201002',
    nama: 'Siti Nurhaliza',
    jurusan: 'Sistem Informasi',
    judulTA: 'Sistem Informasi Manajemen Perpustakaan Berbasis Web',
    filename: 'BAB_1_Pendahuluan.docx',
    date: '2024-01-12',
    size: '1.9 MB',
    status: 'Lolos',
    statusColor: 'success',
    errorCount: 0,
    skor: 100,
    isPassedValidation: true,
    queuePosition: 0
  },
  {
    id: 9,
    userId: 2,
    nrp: '5025201002',
    nama: 'Siti Nurhaliza',
    jurusan: 'Sistem Informasi',
    judulTA: 'Sistem Informasi Manajemen Perpustakaan Berbasis Web',
    filename: 'BAB_3_Metodologi.docx',
    date: '2024-01-09',
    size: '2.5 MB',
    status: 'Tidak Lolos',
    statusColor: 'error',
    errorCount: 7,
    skor: 52,
    isPassedValidation: false,
    queuePosition: 0
  },
  {
    id: 10,
    userId: 2,
    nrp: '5025201002',
    nama: 'Siti Nurhaliza',
    jurusan: 'Sistem Informasi',
    judulTA: 'Sistem Informasi Manajemen Perpustakaan Berbasis Web',
    filename: 'Abstrak.docx',
    date: '2024-01-06',
    size: '0.9 MB',
    status: 'Lolos',
    statusColor: 'success',
    errorCount: 0,
    skor: 100,
    isPassedValidation: true,
    queuePosition: 0
  },
  // Budi Santoso (5025201003) - 5 riwayat
  {
    id: 11,
    userId: 3,
    nrp: '5025201003',
    nama: 'Budi Santoso',
    jurusan: 'Teknik Informatika',
    judulTA: 'Analisis Sentimen Media Sosial Menggunakan Deep Learning',
    filename: 'TA_Budi_Final.docx',
    date: '2024-01-18',
    size: '4.2 MB',
    status: 'Lolos',
    statusColor: 'success',
    errorCount: 0,
    skor: 100,
    isPassedValidation: true,
    queuePosition: 0
  },
  {
    id: 12,
    userId: 3,
    nrp: '5025201003',
    nama: 'Budi Santoso',
    jurusan: 'Teknik Informatika',
    judulTA: 'Analisis Sentimen Media Sosial Menggunakan Deep Learning',
    filename: 'BAB_3_Metodologi.docx',
    date: '2024-01-13',
    size: '1.9 MB',
    status: 'Tidak Lolos',
    statusColor: 'error',
    errorCount: 12,
    skor: 38,
    isPassedValidation: false,
    queuePosition: 0
  },
  {
    id: 13,
    userId: 3,
    nrp: '5025201003',
    nama: 'Budi Santoso',
    jurusan: 'Teknik Informatika',
    judulTA: 'Analisis Sentimen Media Sosial Menggunakan Deep Learning',
    filename: 'BAB_4_Hasil.docx',
    date: '2024-01-11',
    size: '3.2 MB',
    status: 'Lolos',
    statusColor: 'success',
    errorCount: 0,
    skor: 100,
    isPassedValidation: true,
    queuePosition: 0
  },
  {
    id: 14,
    userId: 3,
    nrp: '5025201003',
    nama: 'Budi Santoso',
    jurusan: 'Teknik Informatika',
    judulTA: 'Analisis Sentimen Media Sosial Menggunakan Deep Learning',
    filename: 'BAB_1_Pendahuluan.docx',
    date: '2024-01-07',
    size: '1.6 MB',
    status: 'Tidak Lolos',
    statusColor: 'error',
    errorCount: 4,
    skor: 75,
    isPassedValidation: false,
    queuePosition: 0
  },
  {
    id: 15,
    userId: 3,
    nrp: '5025201003',
    nama: 'Budi Santoso',
    jurusan: 'Teknik Informatika',
    judulTA: 'Analisis Sentimen Media Sosial Menggunakan Deep Learning',
    filename: 'Proposal_Awal.docx',
    date: '2024-01-04',
    size: '2.0 MB',
    status: 'Lolos',
    statusColor: 'success',
    errorCount: 0,
    skor: 100,
    isPassedValidation: true,
    queuePosition: 0
  },
  // Dewi Lestari (5025201004) - 5 riwayat
  {
    id: 16,
    userId: 4,
    nrp: '5025201004',
    nama: 'Dewi Lestari',
    jurusan: 'Sistem Informasi',
    judulTA: 'Aplikasi Mobile untuk Monitoring Kesehatan',
    filename: 'Draft_TA_Revisi.docx',
    date: '2024-01-17',
    size: '2.8 MB',
    status: 'Tidak Lolos',
    statusColor: 'error',
    errorCount: 3,
    skor: 85,
    isPassedValidation: false,
    queuePosition: 0
  },
  {
    id: 17,
    userId: 4,
    nrp: '5025201004',
    nama: 'Dewi Lestari',
    jurusan: 'Sistem Informasi',
    judulTA: 'Aplikasi Mobile untuk Monitoring Kesehatan',
    filename: 'Abstrak_Penelitian.docx',
    date: '2024-01-12',
    size: '0.8 MB',
    status: 'Tidak Lolos',
    statusColor: 'error',
    errorCount: 4,
    skor: 72,
    isPassedValidation: false,
    queuePosition: 0
  },
  {
    id: 18,
    userId: 4,
    nrp: '5025201004',
    nama: 'Dewi Lestari',
    jurusan: 'Sistem Informasi',
    judulTA: 'Aplikasi Mobile untuk Monitoring Kesehatan',
    filename: 'BAB_2_Landasan_Teori.docx',
    date: '2024-01-10',
    size: '2.3 MB',
    status: 'Lolos',
    statusColor: 'success',
    errorCount: 0,
    skor: 100,
    isPassedValidation: true,
    queuePosition: 0
  },
  {
    id: 19,
    userId: 4,
    nrp: '5025201004',
    nama: 'Dewi Lestari',
    jurusan: 'Sistem Informasi',
    judulTA: 'Aplikasi Mobile untuk Monitoring Kesehatan',
    filename: 'BAB_3_Analisis.docx',
    date: '2024-01-08',
    size: '2.1 MB',
    status: 'Tidak Lolos',
    statusColor: 'error',
    errorCount: 6,
    skor: 60,
    isPassedValidation: false,
    queuePosition: 0
  },
  {
    id: 20,
    userId: 4,
    nrp: '5025201004',
    nama: 'Dewi Lestari',
    jurusan: 'Sistem Informasi',
    judulTA: 'Aplikasi Mobile untuk Monitoring Kesehatan',
    filename: 'Proposal.docx',
    date: '2024-01-03',
    size: '1.7 MB',
    status: 'Lolos',
    statusColor: 'success',
    errorCount: 0,
    skor: 100,
    isPassedValidation: true,
    queuePosition: 0
  },
  // Eko Prasetyo (5025201005) - 5 riwayat
  {
    id: 21,
    userId: 5,
    nrp: '5025201005',
    nama: 'Eko Prasetyo',
    jurusan: 'Teknik Komputer',
    judulTA: 'Optimasi Algoritma Routing pada Jaringan IoT',
    filename: 'Draft_Awal.docx',
    date: '2024-01-16',
    size: '1.8 MB',
    status: 'Dibatalkan',
    statusColor: 'default',
    errorCount: null,
    skor: null,
    isPassedValidation: false,
    queuePosition: 0
  },
  {
    id: 22,
    userId: 5,
    nrp: '5025201005',
    nama: 'Eko Prasetyo',
    jurusan: 'Teknik Komputer',
    judulTA: 'Optimasi Algoritma Routing pada Jaringan IoT',
    filename: 'Daftar_Pustaka.docx',
    date: '2024-01-11',
    size: '1.2 MB',
    status: 'Diproses',
    statusColor: 'warning',
    errorCount: null,
    skor: null,
    isPassedValidation: false,
    queuePosition: 0
  },
  {
    id: 23,
    userId: 5,
    nrp: '5025201005',
    nama: 'Eko Prasetyo',
    jurusan: 'Teknik Komputer',
    judulTA: 'Optimasi Algoritma Routing pada Jaringan IoT',
    filename: 'BAB_4_Implementasi.docx',
    date: '2024-01-09',
    size: '3.0 MB',
    status: 'Lolos',
    statusColor: 'success',
    errorCount: 0,
    skor: 100,
    isPassedValidation: true,
    queuePosition: 0
  },
  {
    id: 24,
    userId: 5,
    nrp: '5025201005',
    nama: 'Eko Prasetyo',
    jurusan: 'Teknik Komputer',
    judulTA: 'Optimasi Algoritma Routing pada Jaringan IoT',
    filename: 'BAB_1_Pendahuluan.docx',
    date: '2024-01-06',
    size: '1.4 MB',
    status: 'Tidak Lolos',
    statusColor: 'error',
    errorCount: 9,
    skor: 45,
    isPassedValidation: false,
    queuePosition: 0
  },
  {
    id: 25,
    userId: 5,
    nrp: '5025201005',
    nama: 'Eko Prasetyo',
    jurusan: 'Teknik Komputer',
    judulTA: 'Optimasi Algoritma Routing pada Jaringan IoT',
    filename: 'Proposal_Penelitian.docx',
    date: '2024-01-02',
    size: '2.2 MB',
    status: 'Lolos',
    statusColor: 'success',
    errorCount: 0,
    skor: 100,
    isPassedValidation: true,
    queuePosition: 0
  }
];

// Template data
export const activeTemplate = {
  id: 1,
  name: 'Panduan_TA_2024.docx',
  version: '2025.1',
  date: '2024-01-15'
};

// Statistics helper
export const getStatistics = () => {
  const completedValidations = mockValidations.filter(v => v.status === 'Lolos' || v.status === 'Tidak Lolos');
  const passedValidations = mockValidations.filter(v => v.status === 'Lolos');
  const needsFixValidations = mockValidations.filter(v => v.status === 'Tidak Lolos');
  
  return {
    total: completedValidations.length,
    passed: passedValidations.length,
    needsFix: needsFixValidations.length
  };
};

export const getStatisticsByUser = (nrp) => {
  const userValidations = mockValidations.filter(v => v.nrp === nrp && (v.status === 'Lolos' || v.status === 'Tidak Lolos' || v.status === 'Dalam Antrian' || v.status === 'Diproses'));
  const passedValidations = userValidations.filter(v => v.status === 'Lolos');
  const needsFixValidations = userValidations.filter(v => v.status === 'Tidak Lolos');
  
  return {
    total: userValidations.length,
    passed: passedValidations.length,
    needsFix: needsFixValidations.length
  };
};

// Helper function untuk get validasi by user
export const getValidationsByUser = (nrp) => {
  return mockValidations.filter(v => v.nrp === nrp);
};

// Helper function untuk get validasi by id
export const getValidationById = (id) => {
  return mockValidations.find(v => v.id === parseInt(id)) || mockBookValidations.find(v => v.id === parseInt(id));
};

// Helper function untuk get all validations (admin)
export const getAllValidations = () => {
  return [...mockValidations, ...mockBookValidations];
};

// Mock book validations
// Helper function untuk generate data validasi buku
const generateBookValidations = () => {
  const statuses = ['Lolos', 'Tidak Lolos', 'Dibatalkan'];
  const users = mockUsers.map(u => ({ id: u.id, nrp: u.nrp, nama: u.nama, jurusan: u.jurusan, judul: u.email.split('@')[0] }));
  
  const generateDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };
  
  const validations = [];
  let diprosesAdded = false;
  const usersWithQueue = [1, 2, 3, 4]; // User index yang punya antrian
  
  users.forEach((user, userIndex) => {
    let hasQueueForUser = false;
    
    for (let i = 0; i < 20; i++) {
      let status;
      
      if (!diprosesAdded && userIndex === 1 && i === 0) {
        status = 'Diproses';
        diprosesAdded = true;
        hasQueueForUser = true;
      } else if (!hasQueueForUser && usersWithQueue.includes(userIndex) && i === 1) {
        status = 'Dalam Antrian';
        hasQueueForUser = true;
      } else {
        status = statuses[i % 3];
      }
      
      validations.push({
        id: 100 + userIndex * 20 + i + 1,
        userId: user.id,
        nrp: user.nrp,
        nama: user.nama,
        jurusan: user.jurusan,
        judulBuku: user.judul,
        filename: `Buku_${i + 1}_${user.nama.split(' ')[0]}.zip`,
        numChapters: user.id <= 2 ? 4 : 5,
        totalFiles: user.id <= 2 ? 6 : 7,
        date: generateDate(i * 2 + userIndex),
        size: `${(8 + Math.random() * 3).toFixed(1)} MB`,
        status: status,
        statusColor: status === 'Lolos' ? 'success' : status === 'Tidak Lolos' ? 'error' : status === 'Dalam Antrian' ? 'info' : status === 'Diproses' ? 'warning' : 'default',
        errorCount: status === 'Tidak Lolos' ? Math.floor(Math.random() * 15) + 5 : (status === 'Dalam Antrian' || status === 'Diproses') ? null : 0,
        skor: status === 'Lolos' ? Math.floor(Math.random() * 20) + 80 : status === 'Tidak Lolos' ? Math.floor(Math.random() * 30) + 40 : null,
        isPassedValidation: status === 'Lolos',
        queuePosition: status === 'Dalam Antrian' ? Math.floor(Math.random() * 5) + 2 : status === 'Diproses' ? 1 : undefined,
        type: 'book'
      });
    }
  });
  return validations;
};

export const mockBookValidations = generateBookValidations();

// Keep old data for reference
const oldMockBookValidations = [
  // Ahmad Ridwan (5025201001)
  {
    id: 101,
    userId: 1,
    nrp: '5025201001',
    nama: 'Ahmad Ridwan',
    jurusan: 'Teknik Informatika',
    judulBuku: 'Implementasi Machine Learning untuk Prediksi Cuaca',
    filename: 'Buku_TA_ML_Cuaca.zip',
    numChapters: 5,
    totalFiles: 7,
    date: '2024-01-18',
    size: '9.2 MB',
    status: 'Tidak Lolos',
    statusColor: 'error',
    errorCount: 15,
    skor: 72,
    isPassedValidation: false,
    type: 'book'
  },
  {
    id: 102,
    userId: 1,
    nrp: '5025201001',
    nama: 'Ahmad Ridwan',
    jurusan: 'Teknik Informatika',
    judulBuku: 'Implementasi Machine Learning untuk Prediksi Cuaca',
    filename: 'Buku_TA_Draft_1.zip',
    numChapters: 5,
    totalFiles: 7,
    date: '2024-01-10',
    size: '8.8 MB',
    status: 'Lolos',
    statusColor: 'success',
    errorCount: 0,
    skor: 95,
    isPassedValidation: true,
    type: 'book'
  },
  // Siti Nurhaliza (5025201002)
  {
    id: 103,
    userId: 2,
    nrp: '5025201002',
    nama: 'Siti Nurhaliza',
    jurusan: 'Sistem Informasi',
    judulBuku: 'Sistem Informasi Manajemen Perpustakaan Berbasis Web',
    filename: 'Buku_Lengkap_Perpustakaan.zip',
    numChapters: 4,
    totalFiles: 6,
    date: '2024-01-15',
    size: '8.5 MB',
    status: 'Lolos',
    statusColor: 'success',
    errorCount: 0,
    skor: 98,
    isPassedValidation: true,
    type: 'book'
  },
  {
    id: 104,
    userId: 2,
    nrp: '5025201002',
    nama: 'Siti Nurhaliza',
    jurusan: 'Sistem Informasi',
    judulBuku: 'Sistem Informasi Manajemen Perpustakaan Berbasis Web',
    filename: 'Buku_TA_Revisi.zip',
    numChapters: 4,
    totalFiles: 6,
    date: '2024-01-08',
    size: '8.1 MB',
    status: 'Dalam Antrian',
    statusColor: 'info',
    errorCount: null,
    skor: null,
    isPassedValidation: false,
    queuePosition: 2,
    type: 'book'
  },
  // Budi Santoso (5025201003)
  {
    id: 105,
    userId: 3,
    nrp: '5025201003',
    nama: 'Budi Santoso',
    jurusan: 'Teknik Informatika',
    judulBuku: 'Analisis Sentimen Media Sosial Menggunakan Deep Learning',
    filename: 'Buku_TA_Sentimen_Final.zip',
    numChapters: 5,
    totalFiles: 7,
    date: '2024-01-17',
    size: '10.3 MB',
    status: 'Lolos',
    statusColor: 'success',
    errorCount: 0,
    skor: 100,
    isPassedValidation: true,
    type: 'book'
  },
  {
    id: 106,
    userId: 3,
    nrp: '5025201003',
    nama: 'Budi Santoso',
    jurusan: 'Teknik Informatika',
    judulBuku: 'Analisis Sentimen Media Sosial Menggunakan Deep Learning',
    filename: 'Buku_TA_Draft_2.zip',
    numChapters: 5,
    totalFiles: 7,
    date: '2024-01-12',
    size: '9.7 MB',
    status: 'Tidak Lolos',
    statusColor: 'error',
    errorCount: 8,
    skor: 68,
    isPassedValidation: false,
    type: 'book'
  },
  // Dewi Lestari (5025201004)
  {
    id: 107,
    userId: 4,
    nrp: '5025201004',
    nama: 'Dewi Lestari',
    jurusan: 'Sistem Informasi',
    judulBuku: 'Aplikasi Mobile untuk Monitoring Kesehatan',
    filename: 'Buku_TA_Mobile_Health.zip',
    numChapters: 4,
    totalFiles: 6,
    date: '2024-01-16',
    size: '7.9 MB',
    status: 'Diproses',
    statusColor: 'warning',
    errorCount: null,
    skor: null,
    isPassedValidation: false,
    type: 'book'
  },
  {
    id: 108,
    userId: 4,
    nrp: '5025201004',
    nama: 'Dewi Lestari',
    jurusan: 'Sistem Informasi',
    judulBuku: 'Aplikasi Mobile untuk Monitoring Kesehatan',
    filename: 'Buku_TA_Draft.zip',
    numChapters: 4,
    totalFiles: 6,
    date: '2024-01-09',
    size: '7.5 MB',
    status: 'Tidak Lolos',
    statusColor: 'error',
    errorCount: 12,
    skor: 55,
    isPassedValidation: false,
    type: 'book'
  },
  // Eko Prasetyo (5025201005)
  {
    id: 109,
    userId: 5,
    nrp: '5025201005',
    nama: 'Eko Prasetyo',
    jurusan: 'Teknik Komputer',
    judulBuku: 'Optimasi Algoritma Routing pada Jaringan IoT',
    filename: 'Buku_TA_IoT_Routing.zip',
    numChapters: 5,
    totalFiles: 7,
    date: '2024-01-14',
    size: '9.5 MB',
    status: 'Lolos',
    statusColor: 'success',
    errorCount: 0,
    skor: 92,
    isPassedValidation: true,
    type: 'book'
  },
  {
    id: 110,
    userId: 5,
    nrp: '5025201005',
    nama: 'Eko Prasetyo',
    jurusan: 'Teknik Komputer',
    judulBuku: 'Optimasi Algoritma Routing pada Jaringan IoT',
    filename: 'Buku_TA_Awal.zip',
    numChapters: 5,
    totalFiles: 7,
    date: '2024-01-05',
    size: '8.9 MB',
    status: 'Dibatalkan',
    statusColor: 'default',
    errorCount: null,
    skor: null,
    isPassedValidation: false,
    type: 'book'
  }
];

export const getBookValidationsByUser = (nrp) => {
  return mockBookValidations.filter(v => v.nrp === nrp);
};

export const getBookValidationById = (id) => {
  return mockBookValidations.find(v => v.id === parseInt(id));
};

export const getStatisticsByUserBook = (nrp) => {
  const userValidations = mockBookValidations.filter(v => v.nrp === nrp && (v.status === 'Lolos' || v.status === 'Tidak Lolos' || v.status === 'Dalam Antrian' || v.status === 'Diproses'));
  const passedValidations = userValidations.filter(v => v.status === 'Lolos');
  const needsFixValidations = userValidations.filter(v => v.status === 'Tidak Lolos');
  
  return {
    total: userValidations.length,
    passed: passedValidations.length,
    needsFix: needsFixValidations.length
  };
};
