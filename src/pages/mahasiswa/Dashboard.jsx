import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { useHeader } from '../../context/HeaderContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StatsCards from '../../components/mahasiswa/dashboard/StatsCards';
import ValidationActions from '../../components/mahasiswa/dashboard/ValidationActions';
import ValidationHistory from '../../components/mahasiswa/dashboard/ValidationHistory';
import ConfirmDialog from '../../components/shared/ui/ConfirmDialog';
import NotificationSnackbar from '../../components/shared/ui/NotificationSnackbar';
import { getValidationsByUser } from '../../data/mockData';

export default function MahasiswaDashboard() {
  const { setHeaderInfo } = useHeader();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  
  const historyData = getValidationsByUser(user);
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

  const stats = {
    total: historyData.length,
    passed: historyData.filter(v => v.status === 'Lolos').length,
    needsFix: historyData.filter(v => v.status === 'Tidak Lolos').length
  };

  return (
    <Stack spacing={3}>
      <StatsCards totalValidations={stats.total.toString()} successCount={stats.passed.toString()} needsFixCount={stats.needsFix.toString()} />
      
      <ValidationActions 
        onUpload={() => navigate('/mahasiswa/upload')} 
        hasQueuedDoc={historyData.some(item => item.status === 'Dalam Antrian')} 
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