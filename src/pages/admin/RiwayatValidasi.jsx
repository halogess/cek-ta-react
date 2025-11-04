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
  const prodiFromUrl = searchParams.get('prodi') || 'Semua';
  const [filterStatus, setFilterStatus] = useState(statusFromUrl);
  const [filterProdi, setFilterProdi] = useState(prodiFromUrl);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('terbaru');
  const [searchQuery, setSearchQuery] = useState('');
  const [tempFilterStatus, setTempFilterStatus] = useState(statusFromUrl);
  const [tempFilterProdi, setTempFilterProdi] = useState(prodiFromUrl);
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
    setHeaderInfo({ title: 'Riwayat Validasi Buku Lengkap' });
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo]);

  useEffect(() => {
    fetchValidations();
  }, [filterStatus, filterProdi, startDate, endDate, sortBy, searchQuery]);

  const fetchValidations = async () => {
    try {
      setLoading(true);
      const params = {
        status: filterStatus === 'Semua' ? undefined : filterStatus,
        prodi: filterProdi === 'Semua' ? undefined : filterProdi,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        search: searchQuery || undefined,
        sort: sortBy
      };
      const data = await validationService.getAllBookValidations(params);
      setAllData(data);
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

  useEffect(() => {
    setFilterProdi(prodiFromUrl);
    setTempFilterProdi(prodiFromUrl);
  }, [prodiFromUrl]);

  const handleApplyFilter = () => {
    setFilterStatus(tempFilterStatus);
    setFilterProdi(tempFilterProdi);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setSortBy(tempSortBy);
    setSearchQuery(tempSearchQuery);
    setPage(1);
    fetchValidations();
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
    fetchValidations();
  };

  const handleDownloadCertificate = () => {
    setShowSuccess(true);
  };

  const totalPages = Math.ceil(allData.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = allData.slice(startIndex, endIndex);

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
          totalData={allData.length}
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
