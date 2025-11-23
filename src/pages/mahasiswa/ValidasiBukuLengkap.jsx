import { useState, useEffect } from 'react';
import { Stack, Paper, Pagination, Box, Button, Alert, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
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
import { bukuService, handleApiError } from '../../services';
import { transformBukuData } from '../../utils/dataTransformers';
import { useWebSocket } from '../../hooks/useWebSocket';

export default function UploadBuku() {
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
  const [canUploadBook, setCanUploadBook] = useState(true);
  const [judulBuku, setJudulBuku] = useState('');
  const { subscribe } = useWebSocket();

  const fetchJudulBuku = async () => {
    try {
      const judulData = await bukuService.getBukuJudul();
      setJudulBuku(judulData.judul || '');
    } catch (error) {
      console.error('Error fetching judul buku:', error);
    }
  };

  useEffect(() => {
    setHeaderInfo({ title: 'Validasi Buku Lengkap' });
    checkCanUploadBook();
    fetchJudulBuku();
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo]);

  const checkCanUploadBook = async () => {
    try {
      const result = await bukuService.canUploadBook();
      setCanUploadBook(result.can_upload);
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
      const backendParams = {};
      
      if (filterStatus !== 'Semua') {
        if (filterStatus === 'Menunggu') {
          backendParams.status = 'dalam_antrian,diproses';
        } else {
          const statusMap = {
            'Dibatalkan': 'dibatalkan',
            'Dalam Antrian': 'dalam_antrian',
            'Diproses': 'diproses',
            'Lolos': 'lolos',
            'Tidak Lolos': 'tidak_lolos'
          };
          backendParams.status = statusMap[filterStatus];
        }
      }
      
      backendParams.sort = sortBy;
      backendParams.limit = rowsPerPage;
      backendParams.offset = (page - 1) * rowsPerPage;
      
      const result = await bukuService.getBookValidationsByUser(user, backendParams);
      const transformedData = (result.data || []).map(transformBukuData);
      
      setValidationHistoryData(transformedData);
      setTotalData(result.total || 0);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchValidations();
    }
  }, [user, filterStatus, sortBy, page, rowsPerPage]);

  useEffect(() => {
    const unsubscribeStatusChange = subscribe('buku_status_changed', (data) => {
      console.log('📨 Buku status changed, refreshing...');
      fetchValidations();
      checkCanUploadBook();
    });

    return unsubscribeStatusChange;
  }, [subscribe]);

  useEffect(() => {
    setFilterStatus(statusFromUrl);
    setTempFilterStatus(statusFromUrl);
  }, [statusFromUrl]);

  const handleApplyFilter = () => {
    console.log('🔄 Apply filter:', { tempFilterStatus, tempSortBy });
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
      await bukuService.cancelBuku(item.id);
      setOpenDialog(false);
      setSelectedDoc(null);
      setShowCancelSuccess(true);
      checkCanUploadBook();
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
      await bukuService.uploadBook(data.files, data.judulBuku);
      setShowUploadSuccess(true);
      checkCanUploadBook();
      fetchValidations();
    } catch (error) {
      handleApiError(error);
    }
  };

  const totalPages = Math.ceil(totalData / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalData);
  const paginatedData = validationHistoryData;

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
      {judulBuku && (
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 48, width: 48, height: 48, borderRadius: '12px', bgcolor: '#3B82F6', color: 'white', flexShrink: 0 }}>
              <MenuBookIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Judul Buku TA</Typography>
              <Typography variant="h6" fontWeight="600">{judulBuku}</Typography>
            </Box>
          </Stack>
        </Paper>
      )}
      
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
        hasQueuedBook={!canUploadBook}
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
