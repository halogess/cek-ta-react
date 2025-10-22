// src/pages/Upload.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Stack,
  Radio,
  FormControlLabel,
  Avatar,
  Input,
  Alert,
} from '@mui/material';
import { UploadFileOutlined } from '@mui/icons-material';
import { useHeader } from '../../context/HeaderContext';

// Komponen kecil untuk item di "Informasi Penting"
const InfoListItem = ({ number, text }) => (
  <Stack direction="row" spacing={2} alignItems="center">
    <Avatar sx={{ bgcolor: '#E0E7FF', color: '#3B82F6', width: 24, height: 24, fontSize: '0.875rem', fontWeight: 'bold' }}>
      {number}
    </Avatar>
    <Typography color="text.secondary">{text}</Typography>
  </Stack>
);

// Data sementara - seharusnya dari Redux/API
const historyData = [
  {
    filename: 'Proposal_TA_2024.docx',
    status: 'Dalam Antrian',
  },
];

export default function Upload() {
  const { setHeaderInfo } = useHeader();
  const [file, setFile] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const hasQueuedDoc = historyData.some(item => item.status === 'Dalam Antrian');

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

  const handleChooseFileClick = () => {
    if (!hasQueuedDoc) {
      fileInputRef.current.click();
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
              <Typography variant="body2">Anda memiliki dokumen dalam antrian. Batalkan terlebih dahulu untuk upload dokumen baru.</Typography>
            </Alert>
          )}

          {/* Success Message */}
          {uploadSuccess && (
            <Alert severity="success" sx={{ borderRadius: '12px' }}>
              <Typography fontWeight="medium">Dokumen berhasil diunggah!</Typography>
              <Typography variant="body2">Proses validasi akan dimulai. Anda akan menerima notifikasi setelah selesai.</Typography>
            </Alert>
          )}

          {/* Input File Kustom */}
            <Box
              onClick={handleChooseFileClick}
              sx={{
                border: file ? '2px solid #3B82F6' : '2px dashed #D1D5DB',
                borderRadius: '12px',
                p: 6,
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                cursor: hasQueuedDoc ? 'not-allowed' : 'pointer',
                backgroundColor: file ? '#F0F9FF' : '#FAFBFC',
                opacity: hasQueuedDoc ? 0.5 : 1,
                transition: 'all 0.2s ease',
                '&:hover': { 
                  borderColor: hasQueuedDoc ? '#D1D5DB' : 'primary.main',
                  backgroundColor: hasQueuedDoc ? '#FAFBFC' : '#F8FAFC'
                }
              }}
            >
              <Box sx={{ mb: 2 }}>
                <UploadFileOutlined sx={{ fontSize: 48, color: file ? 'primary.main' : '#9CA3AF' }} />
              </Box>
              
              {file ? (
                <Stack spacing={1} alignItems="center">
                  <Typography variant="h6" fontWeight="medium" color="primary.main">
                    {file.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    File siap untuk divalidasi
                  </Typography>
                  <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                    Ganti File
                  </Button>
                </Stack>
              ) : (
                <Stack spacing={1} alignItems="center">
                  <Typography variant="h6" fontWeight="medium">
                    Pilih file dokumen Anda
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Klik di sini atau seret file .docx ke area ini
                  </Typography>
                  <Button variant="contained" size="small" sx={{ mt: 2 }}>
                    Pilih File
                  </Button>
                </Stack>
              )}
              
              <Input
                type="file"
                inputRef={fileInputRef}
                onChange={handleFileChange}
                sx={{ display: 'none' }}
                inputProps={{ accept: '.docx' }}
              />
            </Box>

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