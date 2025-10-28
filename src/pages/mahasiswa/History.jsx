import React, { useEffect, useState } from 'react';
import { Stack, Paper, Pagination, Box, Typography, FormControl, Select, MenuItem } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useHeader } from '../../context/HeaderContext';
import { useSelector } from 'react-redux';
import HistoryItem from '../../components/shared/ui/HistoryItem';
import FilterBar from '../../components/shared/ui/FilterBar';
import ConfirmDialog from '../../components/shared/ui/ConfirmDialog';
import NotificationSnackbar from '../../components/shared/ui/NotificationSnackbar';
import { getValidationsByUser } from '../../data/mockData';

export default function History() {
  const { setHeaderInfo } = useHeader();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [searchParams] = useSearchParams();
  const statusFromUrl = searchParams.get('status') || 'Semua';
  const [filterStatus, setFilterStatus] = useState(statusFromUrl);
  const [sortBy, setSortBy] = useState('terbaru');
  const [searchQuery, setSearchQuery] = useState('');
  const [tempFilterStatus, setTempFilterStatus] = useState(statusFromUrl);
  const [tempSortBy, setTempSortBy] = useState('terbaru');
  const [tempSearchQuery, setTempSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setHeaderInfo({ title: 'Riwayat Validasi' });
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo]);

  useEffect(() => {
    setFilterStatus(statusFromUrl);
    setTempFilterStatus(statusFromUrl);
  }, [statusFromUrl]);

  const handleApplyFilter = () => {
    setFilterStatus(tempFilterStatus);
    setSortBy(tempSortBy);
    setSearchQuery(tempSearchQuery);
    setPage(1);
  };

  const handleReset = () => {
    setFilterStatus('Semua');
    setSortBy('terbaru');
    setSearchQuery('');
    setTempFilterStatus('Semua');
    setTempSortBy('terbaru');
    setTempSearchQuery('');
    setPage(1);
  };

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

  const validationHistoryData = getValidationsByUser(user);
  
  // Filter dan sort data
  let filteredData = validationHistoryData;
  
  // Filter by status
  if (filterStatus !== 'Semua') {
    if (filterStatus === 'Menunggu') {
      filteredData = filteredData.filter(item => item.status === 'Dalam Antrian' || item.status === 'Diproses');
    } else {
      filteredData = filteredData.filter(item => item.status === filterStatus);
    }
  }
  
  // Filter by search
  if (searchQuery) {
    filteredData = filteredData.filter(item => 
      item.filename.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Sort dengan prioritas Dalam Antrian untuk filter Menunggu
  if (filterStatus === 'Menunggu') {
    filteredData = [...filteredData].sort((a, b) => {
      // Prioritas: Dalam Antrian selalu di atas
      if (a.status === 'Dalam Antrian' && b.status !== 'Dalam Antrian') return -1;
      if (a.status !== 'Dalam Antrian' && b.status === 'Dalam Antrian') return 1;
      
      // Dalam grup yang sama, sort berdasarkan pilihan user
      if (sortBy === 'terbaru') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'terlama') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'nama') {
        return a.filename.localeCompare(b.filename);
      }
      return 0;
    });
  } else {
    // Sort normal untuk filter lainnya
    if (sortBy === 'terbaru') {
      filteredData = [...filteredData].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'terlama') {
      filteredData = [...filteredData].sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'nama') {
      filteredData = [...filteredData].sort((a, b) => a.filename.localeCompare(b.filename));
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setPage(1);
  };

  return (
    <Stack spacing={3}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <FilterBar
          searchQuery={tempSearchQuery}
          onSearchChange={setTempSearchQuery}
          filterStatus={tempFilterStatus}
          onFilterChange={setTempFilterStatus}
          sortBy={tempSortBy}
          onSortChange={setTempSortBy}
          onApplyFilter={handleApplyFilter}
          onReset={handleReset}
        />

        {/* Info Data */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredData.length)} dari {filteredData.length} data
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">Tampilkan:</Typography>
            <FormControl size="small">
              <Select value={rowsPerPage} onChange={handleRowsPerPageChange} sx={{ minWidth: 80 }}>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* List Riwayat */}
        <Stack spacing={2}>
          {paginatedData.map((item) => (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
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