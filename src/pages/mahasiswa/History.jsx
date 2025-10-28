import { useEffect, useState } from 'react';
import { Stack, Paper, Pagination, Box } from '@mui/material';
import Loading from '../../components/shared/ui/Loading';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useHeader } from '../../context/HeaderContext';
import { useSelector } from 'react-redux';
import FilterBar from '../../components/shared/ui/FilterBar';
import DataInfo from '../../components/shared/ui/DataInfo';
import HistoryList from '../../components/shared/ui/HistoryList';
import ConfirmDialog from '../../components/shared/ui/ConfirmDialog';
import NotificationSnackbar from '../../components/shared/ui/NotificationSnackbar';
import { validationService, handleApiError } from '../../services';

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
  const [validationHistoryData, setValidationHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setHeaderInfo({ title: 'Riwayat Validasi' });
    fetchValidations();
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo, user]);

  const fetchValidations = async () => {
    try {
      setLoading(true);
      const data = await validationService.getValidationsByUser(user);
      setValidationHistoryData(data);
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

  const handleConfirmCancel = async () => {
    try {
      const item = validationHistoryData.find(v => v.filename === selectedDoc);
      await validationService.cancelValidation(item.id);
      setOpenDialog(false);
      setSelectedDoc(null);
      setShowCancelSuccess(true);
      fetchValidations();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDownloadCertificate = () => {
    // Logic untuk download sertifikat
    setShowSuccess(true);
  };

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

  if (loading) return <Loading message="Memuat riwayat validasi..." />;

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

        <DataInfo
          startIndex={startIndex}
          endIndex={endIndex}
          totalData={filteredData.length}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        <HistoryList
          data={paginatedData}
          onDetail={(id) => navigate(`/mahasiswa/detail/${id}`)}
          onDownload={handleDownloadCertificate}
          onCancel={handleCancelClick}
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