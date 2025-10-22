// src/pages/mahasiswa/History.jsx

import React, { useEffect, useState } from 'react';
import { Stack, Paper, Box, FormControl, Select, MenuItem, InputLabel, TextField, InputAdornment, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useHeader } from '../../context/HeaderContext';
import HistoryItem from '../../components/dashboard/HistoryItem';
import { SearchOutlined, RestartAlt } from '@mui/icons-material';

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
        {/* Filter dan Sort */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Cari nama file..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1, minWidth: '200px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select value={filterStatus} label="Status" onChange={(e) => setFilterStatus(e.target.value)}>
              <MenuItem value="Semua">Semua Status</MenuItem>
              <MenuItem value="Dalam Antrian">Dalam Antrian</MenuItem>
              <MenuItem value="Menunggu Konfirmasi">Menunggu Konfirmasi</MenuItem>
              <MenuItem value="Selesai">Selesai</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Urutkan</InputLabel>
            <Select value={sortBy} label="Urutkan" onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="terbaru">Terbaru</MenuItem>
              <MenuItem value="terlama">Terlama</MenuItem>
              <MenuItem value="nama">Nama File</MenuItem>
            </Select>
          </FormControl>
          <Button 
            variant="outlined" 
            size="small"
            startIcon={<RestartAlt />}
            onClick={() => {
              setFilterStatus('Semua');
              setSortBy('terbaru');
              setSearchQuery('');
            }}
          >
            Reset
          </Button>
        </Box>

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
              onDetail={() => alert(`Detail: ${item.filename}`)}
              onDownload={handleDownloadCertificate}
            />
          ))}
        </Stack>
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
  );
}