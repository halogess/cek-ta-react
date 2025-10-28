import { useEffect, useState } from 'react';
import { Stack, Paper, Pagination, Box, Typography, FormControl, Select, MenuItem } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useHeader } from '../../context/HeaderContext';
import HistoryItem from '../../components/shared/ui/HistoryItem';
import FilterBar from '../../components/shared/ui/FilterBar';
import NotificationSnackbar from '../../components/shared/ui/NotificationSnackbar';
import { getAllValidations } from '../../data/mockData';

const History = () => {
  const { setHeaderInfo } = useHeader();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusFromUrl = searchParams.get('status') || 'Semua';
  const [filterStatus, setFilterStatus] = useState(statusFromUrl);
  const [filterProdi, setFilterProdi] = useState('Semua');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('terbaru');
  const [searchQuery, setSearchQuery] = useState('');
  const [tempFilterStatus, setTempFilterStatus] = useState(statusFromUrl);
  const [tempFilterProdi, setTempFilterProdi] = useState('Semua');
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');
  const [tempSortBy, setTempSortBy] = useState('terbaru');
  const [tempSearchQuery, setTempSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
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
    setFilterProdi(tempFilterProdi);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setSortBy(tempSortBy);
    setSearchQuery(tempSearchQuery);
    setPage(1);
  };

  const handleReset = () => {
    setFilterStatus('Semua');
    setFilterProdi('Semua');
    setStartDate('');
    setEndDate('');
    setSortBy('terbaru');
    setSearchQuery('');
    setTempFilterStatus('Semua');
    setTempFilterProdi('Semua');
    setTempStartDate('');
    setTempEndDate('');
    setTempSortBy('terbaru');
    setTempSearchQuery('');
    setPage(1);
  };

  const handleDownloadCertificate = () => {
    setShowSuccess(true);
  };

  let filteredData = getAllValidations().filter(item => item.status === 'Lolos' || item.status === 'Tidak Lolos' || item.status === 'Dalam Antrian' || item.status === 'Diproses');

  if (filterStatus !== 'Semua') {
    if (filterStatus === 'Menunggu') {
      filteredData = filteredData.filter(item => item.status === 'Dalam Antrian' || item.status === 'Diproses');
    } else {
      filteredData = filteredData.filter(item => item.status === filterStatus);
    }
  }

  if (filterProdi !== 'Semua') {
    filteredData = filteredData.filter(item => item.jurusan === filterProdi);
  }

  if (startDate) {
    filteredData = filteredData.filter(item => new Date(item.date) >= new Date(startDate));
  }

  if (endDate) {
    filteredData = filteredData.filter(item => new Date(item.date) <= new Date(endDate));
  }

  if (searchQuery) {
    filteredData = filteredData.filter(item => 
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nrp.toLowerCase().includes(searchQuery.toLowerCase())
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
      }
      return 0;
    });
  } else {
    // Sort normal untuk filter lainnya
    if (sortBy === 'terbaru') {
      filteredData = [...filteredData].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'terlama') {
      filteredData = [...filteredData].sort((a, b) => new Date(a.date) - new Date(b.date));
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
          filterProdi={tempFilterProdi}
          onFilterProdiChange={setTempFilterProdi}
          startDate={tempStartDate}
          onStartDateChange={setTempStartDate}
          endDate={tempEndDate}
          onEndDateChange={setTempEndDate}
          sortBy={tempSortBy}
          onSortChange={setTempSortBy}
          onApplyFilter={handleApplyFilter}
          onReset={handleReset}
          isAdminView={true}
        />
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        {/* Info Data */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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

        <Stack spacing={2}>
          {paginatedData.map((item) => (
            <HistoryItem
              key={item.id}
              judulTA={item.judulTA}
              filename={item.filename}
              date={item.date}
              nama={item.nama}
              nrp={item.nrp}
              jurusan={item.jurusan}
              status={item.status}
              statusColor={item.statusColor}
              errorCount={item.errorCount}
              skor={item.skor}
              isPassedValidation={item.isPassedValidation}
              onDetail={() => navigate(`/admin/detail/${item.id}`)}
              onDownload={handleDownloadCertificate}
              showCancelButton={false}
              isAdminView={true}
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

      <NotificationSnackbar
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="Sertifikat berhasil didownload!"
      />
    </Stack>
  );
};

export default History;
