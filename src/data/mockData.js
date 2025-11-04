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
        filename: i % 5 === 0 ? `Bab ${Math.floor(i / 5) + 1}.docx` : i % 5 === 1 ? `BAB_${Math.floor(i / 5) + 1}.docx` : i % 5 === 2 ? `Bab${Math.floor(i / 5) + 1}.docx` : i % 5 === 3 ? `TA_Bab_${Math.floor(i / 5) + 1}.docx` : `Tugas_Akhir_Bab${Math.floor(i / 5) + 1}.docx`,
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
  const judulTA = [
    'Sistem Informasi Manajemen Perpustakaan Berbasis Web',
    'Aplikasi Mobile untuk Monitoring Kesehatan Pasien',
    'Implementasi Machine Learning untuk Prediksi Cuaca',
    'Sistem Keamanan Jaringan Menggunakan Firewall',
    'Perancangan UI/UX Aplikasi E-Commerce',
    'Analisis Sentimen Media Sosial dengan Deep Learning',
    'Sistem Informasi Akademik Berbasis Cloud',
    'Aplikasi Augmented Reality untuk Pendidikan'
  ];
  const users = mockUsers.map((u, idx) => ({ id: u.id, nrp: u.nrp, nama: u.nama, jurusan: u.jurusan, judul: judulTA[idx] }));
  
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
      
      const validationId = 100 + userIndex * 20 + i + 1;
      
      validations.push({
        id: validationId,
        userId: user.id,
        nrp: user.nrp,
        nama: user.nama,
        jurusan: user.jurusan,
        judulBuku: user.judul,
        filename: `BK-${validationId}`,
        seqNumber: String(i + 1).padStart(3, '0'),
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
