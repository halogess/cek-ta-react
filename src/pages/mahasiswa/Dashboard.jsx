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
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Loading from '../../components/shared/ui/Loading';
import { useHeader } from '../../context/HeaderContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StatsCards from '../../components/mahasiswa/dashboard/StatsCards';


import ConfirmDialog from '../../components/shared/ui/ConfirmDialog';
import NotificationSnackbar from '../../components/shared/ui/NotificationSnackbar';
import { validationService, dashboardService, handleApiError } from '../../services';
import { useWebSocket } from '../../hooks/useWebSocket';

export default function MahasiswaDashboard() {
  const { setHeaderInfo } = useHeader();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  
  // State untuk data dan UI
  const [dokumenData, setDokumenData] = useState([]);
  const [bukuData, setBukuData] = useState([]);
  const [judulBuku, setJudulBuku] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [canUpload, setCanUpload] = useState(true);
  const { subscribe } = useWebSocket();
  
  // Stats dari backend (dihitung di fetchValidations)
  const [dokumenStats, setDokumenStats] = useState({ total: 0, waiting: 0, passed: 0, needsFix: 0, cancelled: 0 });
  const [bukuStats, setBukuStats] = useState({ total: 0, waiting: 0, passed: 0, needsFix: 0, cancelled: 0 });
  
  // Check if has queued doc/book
  const hasQueuedDoc = !canUpload;
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
      await validationService.cancelDokumen(item.id);
      setOpenDialog(false);
      setSelectedDoc(null);
      setShowCancelSuccess(true);
      await checkCanUpload();
      await fetchValidations(); // Refresh data
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
    checkCanUpload();
    fetchValidations();
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo, user]);

  useEffect(() => {
    const unsubscribe = subscribe('validation_complete', (data) => {
      console.log('📨 Dashboard: Validation complete');
      fetchValidations();
      checkCanUpload();
    });

    return unsubscribe;
  }, [subscribe]);

  const checkCanUpload = async () => {
    try {
      const result = await validationService.canUpload();
      console.log('🔍 Can upload result:', result);
      setCanUpload(result.can_upload);
    } catch (error) {
      console.error('❌ Can upload error:', error);
      handleApiError(error);
    }
  };

  // Fetch validasi by user dari API
  const fetchValidations = async () => {
    try {
      setLoading(true);
      const stats = await validationService.getDokumenStats();
      
      // Transform backend format to frontend format
      setDokumenStats({
        total: stats.total,
        waiting: stats.dalam_antrian + stats.diproses,
        passed: stats.lolos,
        needsFix: stats.tidak_lolos,
        cancelled: stats.dibatalkan
      });
      
      // Fetch 3 riwayat terbaru
      const history = await validationService.getDokumenByUser(user, { limit: 3, sort: 'desc' });
      
      // Transform backend format to frontend format
      const transformedData = (history.data || []).map(item => ({
        id: item.id,
        filename: item.filename,
        date: item.tanggal_upload,
        size: `${(item.ukuran_file / (1024 * 1024)).toFixed(1)} MB`,
        status: item.status === 'dalam_antrian' ? 'Dalam Antrian' : 
                item.status === 'diproses' ? 'Diproses' :
                item.status === 'lolos' ? 'Lolos' :
                item.status === 'tidak_lolos' ? 'Tidak Lolos' : 'Dibatalkan',
        errorCount: item.jumlah_kesalahan
      }));
      
      setDokumenData(transformedData);
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
    onViewMore: () => navigate('/mahasiswa/dokumen'),
    onCreate: () => navigate('/mahasiswa/dokumen?create=true'),
    onNavigate: (status) => navigate(`/mahasiswa/dokumen?status=${status}`)
  });

  const bukuSections = StatsCards({
    type: 'buku',
    stats: bukuStats,
    historyData: bukuData.slice(0, 3),
    hasQueued: hasQueuedBook,
    onCancel: handleCancelClick,
    onDetail: (id) => navigate(`/mahasiswa/detail/${id}`),
    onDownload: handleDownloadCertificate,
    onViewMore: () => navigate('/mahasiswa/buku'),
    onCreate: () => navigate('/mahasiswa/buku?create=true'),
    onNavigate: (status) => navigate(`/mahasiswa/buku?status=${status}`)
  });

  return (
    <>
      <Stack spacing={3} sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
        {/* Judul Buku TA */}
        {judulBuku && (
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '12px', bgcolor: '#3B82F6', color: 'white' }}>
                <MenuBookIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Judul Buku TA</Typography>
                <Typography variant="h6" fontWeight="600">{judulBuku}</Typography>
              </Box>
            </Stack>
          </Paper>
        )}
        
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