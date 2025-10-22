import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { useHeader } from '../../context/HeaderContext';
import { useNavigate } from 'react-router-dom';
import StatsCards from '../../components/mahasiswa/dashboard/StatsCards';
import ValidationActions from '../../components/mahasiswa/dashboard/ValidationActions';
import ValidationHistory from '../../components/mahasiswa/dashboard/ValidationHistory';
import ConfirmDialog from '../../components/shared/ui/ConfirmDialog';
import NotificationSnackbar from '../../components/shared/ui/NotificationSnackbar';

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
      <StatsCards totalValidations="12" successCount="8" needsFixCount="4" />
      
      <ValidationActions 
        onUpload={() => navigate('/mahasiswa/upload')} 
        hasQueuedDoc={historyData.some(item => item.status === 'Dalam Antrian')} 
      />
      
      <ValidationHistory
        historyData={historyData.slice(0, 5)}
        onCancel={handleCancelClick}
        onDetail={(id) => navigate(`/mahasiswa/detail/${id}`)}
        onDownload={handleDownloadCertificate}
        onViewMore={() => navigate('/mahasiswa/history')}
      />

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