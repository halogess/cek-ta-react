import { useState, useEffect } from 'react';
import { Stack, Paper, Pagination, Box, Button, Alert, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import Loading from '../../components/shared/ui/Loading';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useHeader } from '../../context/HeaderContext';
import { useSelector } from 'react-redux';
import FilterBar from '../../components/shared/ui/FilterBar';
import DataInfo from '../../components/shared/ui/DataInfo';
import HistoryList from '../../components/shared/ui/HistoryList';
import ConfirmDialog from '../../components/shared/ui/ConfirmDialog';
import NotificationSnackbar from '../../components/shared/ui/NotificationSnackbar';
import ValidasiBukuDialog from '../../components/mahasiswa/upload/ValidasiBukuDialog';
import { validationService, handleApiError } from '../../services';

export default function UploadBuku() {
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
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [validationHistoryData, setValidationHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasQueuedBook, setHasQueuedBook] = useState(false);
  const [judulBuku, setJudulBuku] = useState('');

  useEffect(() => {
    setHeaderInfo({ title: 'Validasi Buku Lengkap' });
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo]);

  const fetchValidations = async () => {
    try {
      setLoading(true);
      const params = {
        status: filterStatus === 'Semua' ? undefined : filterStatus,
        search: searchQuery || undefined,
        sort: sortBy
      };
      const data = await validationService.getBookValidationsByUser(user, params);
      setValidationHistoryData(data);
      setHasQueuedBook(data.some(v => v.status === 'Dalam Antrian' || v.status === 'Diproses'));
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchValidations();
      setJudulBuku('Sistem Informasi Manajemen Perpustakaan Berbasis Web');
    }
  }, [user, filterStatus, sortBy, searchQuery]);

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
    setShowSuccess(true);
  };

  const handleCreateSubmit = async (data) => {
    try {
      await validationService.uploadBook(data.files, { judulBuku: data.judulBuku, nrp: user, numChapters: data.numChapters });
      setShowUploadSuccess(true);
      fetchValidations();
    } catch (error) {
      handleApiError(error);
    }
  };

  const totalPages = Math.ceil(validationHistoryData.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = validationHistoryData.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setPage(1);
  };

  if (loading) return <Loading message="Memuat riwayat validasi buku..." />;

  return (
    <Stack spacing={3}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="600">Riwayat Validasi Buku Lengkap</Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={() => setOpenCreateDialog(true)}
            size="small"
          >
            Validasi Buku Baru
          </Button>
        </Box>

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
          totalData={validationHistoryData.length}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        <HistoryList
          data={paginatedData}
          onDetail={(id) => navigate(`/mahasiswa/detail/${id}`)}
          onDownload={handleDownloadCertificate}
          onCancel={handleCancelClick}
        />

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

      <ValidasiBukuDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSubmit={handleCreateSubmit}
        hasQueuedBook={hasQueuedBook}
        judulBuku={judulBuku}
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

      <NotificationSnackbar
        open={showUploadSuccess}
        onClose={() => setShowUploadSuccess(false)}
        message="Buku berhasil disubmit!"
      />
    </Stack>
  );
}
