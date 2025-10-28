import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Button, Stack, Radio, FormControlLabel, Alert } from '@mui/material';
import { UploadFileOutlined } from '@mui/icons-material';
import { useHeader } from '../../context/HeaderContext';
import { useSelector } from 'react-redux';
import FileUploadArea from '../../components/shared/ui/FileUploadArea';
import InfoListItem from '../../components/shared/ui/InfoListItem';
import { getValidationsByUser } from '../../data/mockData';

export default function Upload() {
  const { setHeaderInfo } = useHeader();
  const { user } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const hasQueuedDoc = getValidationsByUser(user).some(v => v.status === 'Dalam Antrian' || v.status === 'Diproses');

  // Mengatur judul header saat komponen dimuat
  useEffect(() => {
    setHeaderInfo({
      title: 'Unggah Dokumen',
      subtitle: 'Validasi dokumen tugas akhir atau tesis Anda',
    });
    return () => {
      setHeaderInfo({ title: '', subtitle: '' });
    };
  }, [setHeaderInfo]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const isButtonDisabled = !file || !isConfirmed || hasQueuedDoc;

  const handleUpload = () => {
    // Simulate upload process
    setUploadSuccess(true);
  };

  return (
    <Stack spacing={4}>
      {/* Kartu Utama untuk Unggah Dokumen */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h5" fontWeight="bold">Pilih Dokumen</Typography>
            <Typography color="text.secondary">Format yang didukung: .docx (Microsoft Word)</Typography>
          </Box>

          {/* Error Message - Dokumen dalam antrian */}
          {hasQueuedDoc && (
            <Alert severity="error" sx={{ borderRadius: '12px' }}>
              <Typography fontWeight="medium">Tidak dapat mengunggah dokumen baru</Typography>
              <Typography variant="body2">Anda memiliki dokumen dalam antrian atau sedang diproses. Batalkan dokumen dalam antrian atau tunggu hingga proses selesai.</Typography>
            </Alert>
          )}

          {/* Success Message */}
          {uploadSuccess && (
            <Alert severity="success" sx={{ borderRadius: '12px' }}>
              <Typography fontWeight="medium">Dokumen berhasil diunggah!</Typography>
              <Typography variant="body2">Proses validasi akan dimulai. Anda akan menerima notifikasi setelah selesai.</Typography>
            </Alert>
          )}

          <FileUploadArea
            file={file}
            onFileChange={handleFileChange}
            disabled={hasQueuedDoc}
          />

          {/* Konfirmasi Keaslian */}
          <Box
            sx={{
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              p: 2,
              backgroundColor: isConfirmed ? '#F0F5FF' : 'transparent'
            }}
          >
            <FormControlLabel
              control={
                <Radio
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  disabled={hasQueuedDoc}
                />
              }
              label={
                <Box>
                  <Typography fontWeight="medium">Konfirmasi Keaslian Dokumen</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Saya menyatakan bahwa dokumen ini adalah hasil karya saya sendiri dan belum pernah divalidasi sebelumnya
                  </Typography>
                </Box>
              }
            />
          </Box>

          {/* Tombol Aksi */}
          <Button
            variant="contained"
            size="large"
            startIcon={<UploadFileOutlined />}
            disabled={isButtonDisabled}
            onClick={handleUpload}
            sx={{ backgroundColor: isButtonDisabled ? '#A5B4FC' : 'primary.main' }}
          >
            Mulai Validasi
          </Button>
        </Stack>
      </Paper>

      {/* Kartu Informasi Penting */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight="bold">Informasi Penting</Typography>
          <InfoListItem number="1" text="Ukuran file maksimal: 20 MB" />
          <InfoListItem number="2" text="Proses validasi memakan waktu sekitar 30 menit" />
          <InfoListItem number="3" text="Anda akan menerima email setelah validasi selesai" />
        </Stack>
      </Paper>
    </Stack>
  );
}