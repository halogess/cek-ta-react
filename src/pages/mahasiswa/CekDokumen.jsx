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
import CekDokumenDialog from '../../components/mahasiswa/upload/CekDokumenDialog';
import { validationService, handleApiError } from '../../services';
import { useWebSocket } from '../../hooks/useWebSocket';
import { formatDate } from '../../utils/dataTransformers';

export default function Upload() {
  const { setHeaderInfo } = useHeader();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [searchParams] = useSearchParams();
  const statusFromUrl = searchParams.get('status') || 'Semua';
  const [filterStatus, setFilterStatus] = useState(statusFromUrl);
  const [sortBy, setSortBy] = useState('terbaru');
  const [tempFilterStatus, setTempFilterStatus] = useState(statusFromUrl);
  const [tempSortBy, setTempSortBy] = useState('terbaru');
  const [openDialog, setOpenDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const createFromUrl = searchParams.get('create') === 'true';
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [validationHistoryData, setValidationHistoryData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [canUpload, setCanUpload] = useState(true);
  const { subscribe } = useWebSocket();

  useEffect(() => {
    setHeaderInfo({ title: 'Cek Dokumen' });
    checkCanUpload();
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo]);

  useEffect(() => {
    if (openCreateDialog) {
      checkCanUpload();
    }
  }, [openCreateDialog]);

  const checkCanUpload = async () => {
    try {
      const result = await validationService.canUpload();
      setCanUpload(result.can_upload);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    if (createFromUrl) {
      setOpenCreateDialog(true);
    }
  }, [createFromUrl]);

  const fetchValidations = async () => {
    try {
      setLoading(true);
      const params = {
        status: filterStatus === 'Semua' ? undefined : filterStatus,
        sort: sortBy,
        limit: rowsPerPage,
        offset: (page - 1) * rowsPerPage
      };
      const response = await validationService.getDokumenByUser(user, params);
      
      const statusMap = {
        'dibatalkan': 'Dibatalkan',
        'dalam_antrian': 'Dalam Antrian',
        'diproses': 'Diproses',
        'lolos': 'Lolos',
        'tidak_lolos': 'Tidak Lolos'
      };
      
      const transformedData = response.data.map(item => ({
        id: item.id,
        filename: item.filename,
        date: formatDate(item.tanggal_upload),
        size: `${(item.ukuran_file / (1024 * 1024)).toFixed(1)} MB`,
        status: statusMap[item.status] || item.status,
        errorCount: item.jumlah_kesalahan,
        isPassedValidation: item.status === 'lolos'
      }));
      
      setValidationHistoryData(transformedData);
      setTotalData(response.total);
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
    if (user) fetchValidations();
  }, [user, filterStatus, sortBy, page, rowsPerPage]);

  useEffect(() => {
    const unsubscribeComplete = subscribe('validation_complete', () => {
      fetchValidations();
      checkCanUpload();
    });

    const unsubscribeStatus = subscribe('validation_status', (data) => {
      const statusMap = {
        'dalam_antrian': 'Dalam Antrian',
        'diproses': 'Diproses',
        'lolos': 'Lolos',
        'tidak_lolos': 'Tidak Lolos'
      };
      
      setValidationHistoryData(prev => 
        prev.map(item => 
          item.id === data.dokumen_id 
            ? { ...item, status: statusMap[data.status] || data.status }
            : item
        )
      );
      checkCanUpload();
    });

    return () => {
      unsubscribeComplete();
      unsubscribeStatus();
    };
  }, [subscribe]);

  const handleApplyFilter = () => {
    setFilterStatus(tempFilterStatus);
    setSortBy(tempSortBy);
    setPage(1);
  };

  const handleReset = () => {
    setFilterStatus('Semua');
    setSortBy('terbaru');
    setTempFilterStatus('Semua');
    setTempSortBy('terbaru');
    setPage(1);
  };

  const handleCancelClick = (filename) => {
    setSelectedDoc(filename);
    setOpenDialog(true);
  };

  const handleConfirmCancel = async () => {
    try {
      const item = validationHistoryData.find(v => v.filename === selectedDoc);
      await validationService.cancelDokumen(item.id);
      setOpenDialog(false);
      setSelectedDoc(null);
      setShowCancelSuccess(true);
      await checkCanUpload();
      await fetchValidations();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDownloadCertificate = () => {
    setShowSuccess(true);
  };

  const handleCreateSubmit = async (file) => {
    const result = await validationService.uploadDokumen(file);
    setShowUploadSuccess(true);
    setOpenCreateDialog(false);
    checkCanUpload();
    fetchValidations();
    return result;
  };

  const totalPages = Math.ceil(totalData / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalData);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setPage(1);
  };

  if (loading) return <Loading message="Memuat riwayat cek dokumen..." />;

  return (
    <Stack spacing={3}>
      <Alert severity="info" sx={{ borderRadius: '12px' }}>
        <Typography variant="body2">
          Riwayat cek dokumen akan dihapus otomatis setiap 30 hari sekali
        </Typography>
      </Alert>

      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="600">Riwayat Cek Dokumen</Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={() => setOpenCreateDialog(true)}
            size="small"
            disabled={!canUpload}
          >
            Cek Dokumen Baru
          </Button>
        </Box>

        <FilterBar
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
          totalData={totalData}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        <HistoryList
          data={validationHistoryData}
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

      {openCreateDialog && (
        <CekDokumenDialog
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
          onSubmit={handleCreateSubmit}
          canUpload={canUpload}
        />
      )}

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
        message="Dokumen berhasil disubmit!"
      />
    </Stack>
  );
}