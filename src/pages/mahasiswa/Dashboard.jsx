/**
 * Mahasiswa Dashboard - Halaman utama untuk mahasiswa
 * Menampilkan:
 * - Statistik validasi (total, waiting, passed, needs fix)
 * - Quick actions (upload, view template)
 * - Riwayat validasi terbaru (5 terakhir)
 * - Alert jika ada dokumen sedang diproses
 */

import { useEffect, useState } from 'react';
import { Stack, Alert, Typography } from '@mui/material';
import Loading from '../../components/shared/ui/Loading';
import { useHeader } from '../../context/HeaderContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StatsCards from '../../components/mahasiswa/dashboard/StatsCards';
import ValidationActions from '../../components/mahasiswa/dashboard/ValidationActions';
import ValidationHistory from '../../components/mahasiswa/dashboard/ValidationHistory';
import ConfirmDialog from '../../components/shared/ui/ConfirmDialog';
import NotificationSnackbar from '../../components/shared/ui/NotificationSnackbar';
import { validationService, handleApiError } from '../../services';

export default function MahasiswaDashboard() {
  const { setHeaderInfo } = useHeader();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  
  // State untuk data dan UI
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  
  // Cari dokumen yang sedang diproses untuk alert
  const processingDoc = historyData.find(item => item.status === 'Diproses');
  
  // Hitung statistik dari historyData
  const stats = {
    total: historyData.length,
    waiting: historyData.filter(v => v.status === 'Dalam Antrian' || v.status === 'Diproses').length,
    cancelled: historyData.filter(v => v.status === 'Dibatalkan').length,
    passed: historyData.filter(v => v.status === 'Lolos').length,
    needsFix: historyData.filter(v => v.status === 'Tidak Lolos').length
  };

  // Handler untuk buka dialog konfirmasi cancel
  const handleCancelClick = (filename) => {
    setSelectedDoc(filename);
    setOpenDialog(true);
  };

  // Handler untuk konfirmasi cancel validasi
  const handleConfirmCancel = async () => {
    try {
      const item = historyData.find(v => v.filename === selectedDoc);
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
      const data = await validationService.getValidationsByUser(user);
      setHistoryData(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Memuat dashboard..." />;

  return (
    <Stack spacing={3}>
      {processingDoc && (
        <Alert severity="info" sx={{ borderRadius: '12px' }}>
          <Typography fontWeight="medium">Dokumen Sedang Diproses</Typography>
          <Typography variant="body2">{processingDoc.filename} sedang dalam proses validasi. Anda akan menerima notifikasi setelah selesai.</Typography>
        </Alert>
      )}
      
      <StatsCards stats={stats} />
      
      <ValidationActions 
        onUpload={() => navigate('/mahasiswa/upload')} 
        hasQueuedDoc={historyData.some(item => item.status === 'Dalam Antrian' || item.status === 'Diproses')} 
      />
      
      {historyData.length > 0 && (
        <ValidationHistory
          historyData={historyData.slice(0, 5)}
          onCancel={handleCancelClick}
          onDetail={(id) => navigate(`/mahasiswa/detail/${id}`)}
          onDownload={handleDownloadCertificate}
          onViewMore={() => navigate('/mahasiswa/history')}
        />
      )}

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