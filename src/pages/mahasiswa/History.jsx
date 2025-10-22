import React, { useEffect, useState } from 'react';
import { Stack, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useHeader } from '../../context/HeaderContext';
import HistoryItem from '../../components/shared/ui/HistoryItem';
import FilterBar from '../../components/shared/ui/FilterBar';
import ConfirmDialog from '../../components/shared/ui/ConfirmDialog';
import NotificationSnackbar from '../../components/shared/ui/NotificationSnackbar';

// Data statis untuk simulasi
const validationHistoryData = [
  {
    id: 1,
    filename: 'Proposal_TA_2024.docx',
    date: '2024-01-20',
    size: '2.4 MB',
    status: 'Dalam Antrian',
    statusColor: 'primary',
    errorCount: 0,
  },
  {
    id: 2,
    filename: 'Tesis_Final_2024.docx',
    date: '2024-01-19',
    size: '3.1 MB',
    status: 'Menunggu Konfirmasi',
    statusColor: 'warning',
    errorCount: 5,
  },
  {
    id: 3,
    filename: 'Draft_TA_Revisi.docx',
    date: '2024-01-18',
    size: '2.8 MB',
    status: 'Selesai',
    statusColor: 'success',
    errorCount: 3,
    isPassedValidation: false,
  },
  {
    id: 4,
    filename: 'BAB_1_Pendahuluan.docx',
    date: '2024-01-17',
    size: '1.5 MB',
    status: 'Selesai',
    statusColor: 'success',
    errorCount: 8,
    isPassedValidation: false,
  },
  {
    id: 5,
    filename: 'BAB_2_Tinjauan_Pustaka.docx',
    date: '2024-01-16',
    size: '2.2 MB',
    status: 'Menunggu Konfirmasi',
    statusColor: 'warning',
    errorCount: 2,
  },
  {
    id: 6,
    filename: 'BAB_3_Metodologi.docx',
    date: '2024-01-15',
    size: '1.9 MB',
    status: 'Selesai',
    statusColor: 'success',
    errorCount: 12,
    isPassedValidation: false,
  },
  {
    id: 7,
    filename: 'Laporan_Skripsi_Final.docx',
    date: '2024-01-14',
    size: '4.2 MB',
    status: 'Selesai',
    statusColor: 'success',
    errorCount: 0,
    isPassedValidation: true,
  },
  {
    id: 8,
    filename: 'Abstrak_Penelitian.docx',
    date: '2024-01-13',
    size: '0.8 MB',
    status: 'Selesai',
    statusColor: 'success',
    errorCount: 4,
    isPassedValidation: false,
  },
  {
    id: 9,
    filename: 'Daftar_Pustaka.docx',
    date: '2024-01-12',
    size: '1.2 MB',
    status: 'Menunggu Konfirmasi',
    statusColor: 'warning',
    errorCount: 1,
  },
  {
    id: 10,
    filename: 'Lampiran_Data.docx',
    date: '2024-01-11',
    size: '3.5 MB',
    status: 'Selesai',
    statusColor: 'success',
    errorCount: 6,
    isPassedValidation: false,
  },
];


export default function History() {
  const { setHeaderInfo } = useHeader();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [sortBy, setSortBy] = useState('terbaru');
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);

  useEffect(() => {
    setHeaderInfo({ title: 'Riwayat Validasi' });
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo]);

  const handleCancelClick = (filename) => {
    setSelectedDoc(filename);
    setOpenDialog(true);
  };

  const handleConfirmCancel = () => {
    // Logic untuk membatalkan dokumen
    setOpenDialog(false);
    setSelectedDoc(null);
    setShowCancelSuccess(true);
  };

  const handleDownloadCertificate = () => {
    // Logic untuk download sertifikat
    setShowSuccess(true);
  };

  // Filter dan sort data
  let filteredData = validationHistoryData;
  
  // Filter by status
  if (filterStatus !== 'Semua') {
    filteredData = filteredData.filter(item => item.status === filterStatus);
  }
  
  // Filter by search
  if (searchQuery) {
    filteredData = filteredData.filter(item => 
      item.filename.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Sort
  if (sortBy === 'terbaru') {
    filteredData = [...filteredData].sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy === 'terlama') {
    filteredData = [...filteredData].sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortBy === 'nama') {
    filteredData = [...filteredData].sort((a, b) => a.filename.localeCompare(b.filename));
  }

  return (
    <Stack spacing={3}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onReset={() => {
            setFilterStatus('Semua');
            setSortBy('terbaru');
            setSearchQuery('');
          }}
        />

        {/* List Riwayat */}
        <Stack spacing={2}>
          {filteredData.map((item) => (
            <HistoryItem
              key={item.id}
              filename={item.filename}
              date={item.date}
              size={item.size}
              status={item.status}
              statusColor={item.statusColor}
              errorCount={item.errorCount}
              onCancel={() => handleCancelClick(item.filename)}
              isPassedValidation={item.isPassedValidation}
              onDetail={() => navigate(`/mahasiswa/detail/${item.id}`)}
              onDownload={handleDownloadCertificate}
            />
          ))}
        </Stack>
      </Paper>

      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmCancel}
        title="Batalkan Validasi?"
        message={<>Apakah Anda yakin ingin membatalkan validasi dokumen <strong>{selectedDoc}</strong>? Tindakan ini tidak dapat dibatalkan.</>}
      />

      <NotificationSnackbar
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="Sertifikat berhasil didownload!"
      />
      
      <NotificationSnackbar
        open={showCancelSuccess}
        onClose={() => setShowCancelSuccess(false)}
        message="Dokumen berhasil dibatalkan!"
      />
    </Stack>
  );
}