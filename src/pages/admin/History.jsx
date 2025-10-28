import { useEffect, useState } from 'react';
import { Stack, Paper, Pagination, Box } from '@mui/material';
import Loading from '../../components/shared/ui/Loading';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useHeader } from '../../context/HeaderContext';
import FilterBar from '../../components/shared/ui/FilterBar';
import NotificationSnackbar from '../../components/shared/ui/NotificationSnackbar';
import DataInfo from '../../components/shared/ui/DataInfo';
import HistoryList from '../../components/shared/ui/HistoryList';
import { validationService, handleApiError } from '../../services';

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
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setHeaderInfo({ title: 'Riwayat Validasi' });
    fetchValidations();
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo]);

  const fetchValidations = async () => {
    try {
      setLoading(true);
      const data = await validationService.getAllValidations();
      setAllData(data.filter(item => item.status === 'Lolos' || item.status === 'Tidak Lolos' || item.status === 'Dalam Antrian' || item.status === 'Diproses'));
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

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

  let filteredData = allData;

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

  if (loading) return <Loading message="Memuat riwayat validasi..." />;

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
        <DataInfo
          startIndex={startIndex}
          endIndex={endIndex}
          totalData={filteredData.length}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        <HistoryList
          data={paginatedData}
          onDetail={(id) => navigate(`/admin/detail/${id}`)}
          onDownload={handleDownloadCertificate}
          isAdminView={true}
        />

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
