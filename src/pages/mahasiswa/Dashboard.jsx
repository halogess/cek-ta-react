/**
 * Mahasiswa Dashboard - Halaman utama untuk mahasiswa
 * Menampilkan:
 * - Statistik validasi (total, waiting, passed, needs fix)
 * - Quick actions (upload, view template)
 * - Riwayat validasi terbaru (5 terakhir)
 * - Alert jika ada dokumen sedang diproses
 */

import { useEffect, useState } from 'react';
import { Box, Stack, Paper, Typography } from '@mui/material';
import Loading from '../../components/shared/ui/Loading';
import { useHeader } from '../../context/HeaderContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StatsCards from '../../components/mahasiswa/dashboard/StatsCards';


import ConfirmDialog from '../../components/shared/ui/ConfirmDialog';
import NotificationSnackbar from '../../components/shared/ui/NotificationSnackbar';
import { validationService, dashboardService, handleApiError } from '../../services';

export default function MahasiswaDashboard() {
  const { setHeaderInfo } = useHeader();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  
  // State untuk data dan UI
  const [dokumenData, setDokumenData] = useState([]);
  const [bukuData, setBukuData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  
  // Stats dari backend (dihitung di fetchValidations)
  const [dokumenStats, setDokumenStats] = useState({ total: 0, waiting: 0, passed: 0, needsFix: 0, cancelled: 0 });
  const [bukuStats, setBukuStats] = useState({ total: 0, waiting: 0, passed: 0, needsFix: 0, cancelled: 0 });
  
  // Check if has queued doc/book
  const hasQueuedDoc = dokumenData.some(v => v.status === 'Dalam Antrian' || v.status === 'Diproses');
  const hasQueuedBook = bukuData.some(v => v.status === 'Dalam Antrian' || v.status === 'Diproses');

  // Handler untuk buka dialog konfirmasi cancel
  const handleCancelClick = (filename) => {
    setSelectedDoc(filename);
    setOpenDialog(true);
  };

  // Handler untuk konfirmasi cancel validasi
  const handleConfirmCancel = async () => {
    try {
      const allData = [...dokumenData, ...bukuData];
      const item = allData.find(v => v.filename === selectedDoc);
      await validationService.cancelValidation(item.id);
      setOpenDialog(false);
      setSelectedDoc(null);
      setShowCancelSuccess(true);
      fetchValidations(); // Refresh data
    } catch (error) {
      handleApiError(error);
    }
  };

  // Handler untuk download certificate
  const handleDownloadCertificate = () => {
    setShowSuccess(true);
  };
  
  // Set header title dan fetch data saat mount
  useEffect(() => {
    setHeaderInfo({ title: 'Dashboard' });
    fetchValidations();
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo, user]);

  // Fetch validasi by user dari API
  const fetchValidations = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getMahasiswaDashboard(user);
      setDokumenData(data.dokumen.history);
      setBukuData(data.buku.history);
      setDokumenStats(data.dokumen.stats);
      setBukuStats(data.buku.stats);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Memuat dashboard..." />;

  const dokumenSections = StatsCards({
    type: 'dokumen',
    stats: dokumenStats,
    historyData: dokumenData.slice(0, 3),
    hasQueued: hasQueuedDoc,
    onCancel: handleCancelClick,
    onDetail: (id) => navigate(`/mahasiswa/detail/${id}`),
    onDownload: handleDownloadCertificate,
    onViewMore: () => navigate('/mahasiswa/upload'),
    onCreate: () => navigate('/mahasiswa/upload'),
    onNavigate: (status) => navigate(`/mahasiswa/upload?status=${status}`)
  });

  const bukuSections = StatsCards({
    type: 'buku',
    stats: bukuStats,
    historyData: bukuData.slice(0, 3),
    hasQueued: hasQueuedBook,
    onCancel: handleCancelClick,
    onDetail: (id) => navigate(`/mahasiswa/detail/${id}`),
    onDownload: handleDownloadCertificate,
    onViewMore: () => navigate('/mahasiswa/upload-buku'),
    onCreate: () => navigate('/mahasiswa/upload-buku'),
    onNavigate: (status) => navigate(`/mahasiswa/upload-buku?status=${status}`)
  });

  return (
    <>
      <Stack spacing={3} sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
        {/* Cek Dokumen Section */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #E2E8F0', minWidth: 0 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, width: '100%', gap: 3, minWidth: 0 }}>
            <Stack spacing={2} sx={{ minWidth: 0 }}>
              {dokumenSections.title}
              {dokumenSections.stats}
              {dokumenSections.info}
            </Stack>
            
            <Stack spacing={2} sx={{ minWidth: 0, borderLeft: { xs: 'none', lg: '1px solid #E2E8F0' }, pl: { xs: 0, lg: 3 } }}>
              <Typography variant="h6" fontWeight="bold">Riwayat Terbaru</Typography>
              {dokumenSections.history}
            </Stack>
          </Box>
        </Paper>
        
        {/* Validasi Buku Lengkap Section */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #E2E8F0', minWidth: 0 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, width: '100%', gap: 3, minWidth: 0 }}>
            <Stack spacing={2} sx={{ minWidth: 0 }}>
              {bukuSections.title}
              {bukuSections.stats}
              {bukuSections.info}
            </Stack>
            
            <Stack spacing={2} sx={{ minWidth: 0, borderLeft: { xs: 'none', lg: '1px solid #E2E8F0' }, pl: { xs: 0, lg: 3 } }}>
              <Typography variant="h6" fontWeight="bold">Riwayat Terbaru</Typography>
              {bukuSections.history}
            </Stack>
          </Box>
        </Paper>
      </Stack>

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
    </>
  );
}