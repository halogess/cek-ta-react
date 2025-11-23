export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} ${hours}:${minutes}`;
};

export const transformDokumenData = (item) => ({
  id: item.id,
  filename: item.filename,
  date: item.tanggal_upload,
  size: `${(item.ukuran_file / (1024 * 1024)).toFixed(1)} MB`,
  status: transformStatus(item.status),
  errorCount: item.jumlah_kesalahan
});

export const transformBukuData = (item) => ({
  id: item.id,
  type: 'book',
  filename: `#${item.id} | ${formatDate(item.tanggal_upload)}`,
  judulBuku: item.judul,
  date: formatDate(item.tanggal_upload),
  numChapters: item.jumlah_bab,
  bab: item.bab || [],
  status: transformStatus(item.status),
  errorCount: item.jumlah_kesalahan,
  skor: item.skor
});

export const transformStatus = (status) => {
  const statusMap = {
    'dalam_antrian': 'Dalam Antrian',
    'diproses': 'Diproses',
    'lolos': 'Lolos',
    'tidak_lolos': 'Tidak Lolos',
    'dibatalkan': 'Dibatalkan'
  };
  return statusMap[status] || status;
};

export const transformStats = (statsData) => ({
  total: statsData.total || 0,
  waiting: (statsData.dalam_antrian || 0) + (statsData.diproses || 0),
  passed: statsData.lolos || 0,
  needsFix: statsData.tidak_lolos || 0,
  cancelled: statsData.dibatalkan || 0
});
