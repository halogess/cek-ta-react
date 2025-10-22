// src/pages/mahasiswa/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, Button, Stack, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert } from '@mui/material';
import { FileCopyOutlined, CheckCircleOutline, WarningAmberOutlined, UploadOutlined } from '@mui/icons-material';
import { useHeader } from '../../context/HeaderContext';
import { useNavigate } from 'react-router-dom';
// Impor komponen baru
import StatCard from '../../components/dashboard/StatCard';
import HistoryItem from '../../components/dashboard/HistoryItem';

// Data sementara untuk riwayat
const historyData = [
  {
    filename: 'Proposal_TA_2024.docx',
    date: '2024-01-20',
    size: '2.4 MB',
    status: 'Dalam Antrian',
    statusColor: 'primary',
    errorCount: 0,
  },
  {
    filename: 'Tesis_Final_2024.docx',
    date: '2024-01-19',
    size: '3.1 MB',
    status: 'Menunggu Konfirmasi',
    statusColor: 'warning',
    errorCount: 5,
  },
  {
    filename: 'Draft_TA_Revisi.docx',
    date: '2024-01-18',
    size: '2.8 MB',
    status: 'Selesai',
    statusColor: 'success',
    errorCount: 3,
    isPassedValidation: false,
  },
  {
    filename: 'BAB_1_Pendahuluan.docx',
    date: '2024-01-17',
    size: '1.5 MB',
    status: 'Selesai',
    statusColor: 'success',
    errorCount: 8,
    isPassedValidation: false,
  },
  {
    filename: 'BAB_2_Tinjauan_Pustaka.docx',
    date: '2024-01-16',
    size: '2.2 MB',
    status: 'Menunggu Konfirmasi',
    statusColor: 'warning',
    errorCount: 2,
  },
  {
    filename: 'BAB_3_Metodologi.docx',
    date: '2024-01-15',
    size: '1.9 MB',
    status: 'Selesai',
    statusColor: 'success',
    errorCount: 12,
    isPassedValidation: false,
  },
  {
    filename: 'Laporan_Skripsi_Final.docx',
    date: '2024-01-14',
    size: '4.2 MB',
    status: 'Selesai',
    statusColor: 'success',
    errorCount: 0,
    isPassedValidation: true,
  },
  {
    filename: 'Abstrak_Penelitian.docx',
    date: '2024-01-13',
    size: '0.8 MB',
    status: 'Selesai',
    statusColor: 'success',
    errorCount: 4,
    isPassedValidation: false,
  },
  {
    filename: 'Daftar_Pustaka.docx',
    date: '2024-01-12',
    size: '1.2 MB',
    status: 'Menunggu Konfirmasi',
    statusColor: 'warning',
    errorCount: 1,
  },
  {
    filename: 'Lampiran_Data.docx',
    date: '2024-01-11',
    size: '3.5 MB',
    status: 'Selesai',
    statusColor: 'success',
    errorCount: 6,
    isPassedValidation: false,
  },
];
export default function MahasiswaDashboard() {
  const { setHeaderInfo } = useHeader();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);

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
  useEffect(() => {
    setHeaderInfo({
      title: 'Dashboard',
    });
    return () => {
      setHeaderInfo({ title: '', subtitle: '' });
    };
  }, [setHeaderInfo]);

  return (
    <Stack spacing={3}>
      {/* Kartu Statistik */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '250px' }}>
          <StatCard title="Total Validasi" value="12" subtitle="Dokumen divalidasi" icon={<FileCopyOutlined />} iconColor="text.secondary" />
        </Box>
        <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '250px' }}>
          <StatCard title="Validasi Berhasil" value="8" subtitle="Lolos validasi" icon={<CheckCircleOutline />} iconColor="success.main" />
        </Box>
        <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '250px' }}>
          <StatCard title="Perlu Perbaikan" value="4" subtitle="Dokumen dengan kesalahan" icon={<WarningAmberOutlined />} iconColor="warning.main" />
        </Box>
      </Box>

      {/* Kartu Aksi dan Riwayat (tidak ada perubahan di sini) */}
      <Stack spacing={3}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <Typography variant="h6" fontWeight="bold">Validasi Dokumen Baru</Typography>
          <Typography color="text.secondary" sx={{ my: 1 }}>Unggah dokumen tugas akhir atau tesis Anda untuk divalidasi</Typography>
          <Button 
            variant="contained" 
            size="large" 
            startIcon={<UploadOutlined />}
            onClick={() => navigate('/mahasiswa/upload')}
            disabled={historyData.some(item => item.status === 'Dalam Antrian')}
          >
            Mulai Validasi
          </Button>
          {historyData.some(item => item.status === 'Dalam Antrian') && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Anda memiliki dokumen dalam antrian. Batalkan terlebih dahulu untuk upload dokumen baru.
            </Typography>
          )}
        </Paper>

        <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <Typography variant="h6" fontWeight="bold">Riwayat Validasi Terbaru</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>Dokumen yang baru saja Anda validasi</Typography>
          <Stack spacing={2}>
            {historyData.slice(0, 5).map((item, index) => (
              <HistoryItem
                key={index}
                filename={item.filename}
                date={item.date}
                size={item.size}
                status={item.status}
                statusColor={item.statusColor}
                errorCount={item.errorCount}
                onCancel={() => handleCancelClick(item.filename)}
                isPassedValidation={item.isPassedValidation}
                onDetail={() => alert(`Detail: ${item.filename}`)}
                onDownload={handleDownloadCertificate}
              />
            ))}
          </Stack>
          <Button 
            variant="text" 
            onClick={() => navigate('/mahasiswa/history')}
            sx={{ mt: 2 }}
          >
            Lihat Selengkapnya
          </Button>
        </Paper>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Batalkan Validasi?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Apakah Anda yakin ingin membatalkan validasi dokumen <strong>{selectedDoc}</strong>? Tindakan ini tidak dapat dibatalkan.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Batal</Button>
            <Button onClick={handleConfirmCancel} color="error" variant="contained">Ya, Batalkan</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={showSuccess} autoHideDuration={3000} onClose={() => setShowSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
            Sertifikat berhasil didownload!
          </Alert>
        </Snackbar>
        <Snackbar open={showCancelSuccess} autoHideDuration={3000} onClose={() => setShowCancelSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={() => setShowCancelSuccess(false)} severity="success" sx={{ width: '100%' }}>
            Dokumen berhasil dibatalkan!
          </Alert>
        </Snackbar>
      </Stack>
    </Stack>
  );
}