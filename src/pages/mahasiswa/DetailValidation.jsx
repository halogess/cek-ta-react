import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stack, Button, Box, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Paper, Typography } from '@mui/material';
import { ArrowBack, FileDownloadOutlined, PictureAsPdfOutlined } from '@mui/icons-material';
import { useHeader } from '../../context/HeaderContext';
import ValidationSummary from '../../components/mahasiswa/validation/ValidationSummary';
import ErrorListPanel from '../../components/mahasiswa/detail/ErrorListPanel';
import DocumentStructurePanel from '../../components/mahasiswa/detail/DocumentStructurePanel';
import StatusBanner from '../../components/mahasiswa/detail/StatusBanner';
import DocumentPreview from '../../components/mahasiswa/detail/DocumentPreview';
import Loading from '../../components/shared/ui/Loading';
import { validationService, handleApiError } from '../../services';


export default function DetailValidation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeaderInfo } = useHeader();
  const [expanded, setExpanded] = useState(false);
  const [selectedError, setSelectedError] = useState(-1);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  
  const [validation, setValidation] = useState(null);
  const [documentStructure, setDocumentStructure] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const documentStatus = validation?.status || 'Selesai';
  const isPassedValidation = validation?.isPassedValidation || false;
  const queuePosition = validation?.queuePosition || 0;
  const hasValidationData = validation?.errorCount !== null && validation?.skor !== null;
  const isBookValidation = validation?.type === 'book';

  useEffect(() => {
    setHeaderInfo({ title: 'Detail Validasi' });
    fetchValidation();
    window.scrollTo(0, 0);
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo, id]);

  const fetchValidation = async () => {
    try {
      setLoading(true);
      const data = await validationService.getValidationById(id);
      setValidation(data);
      
      if (data.errorCount !== null && data.skor !== null) {
        const [structureData, errorsData] = await Promise.all([
          validationService.getDocumentStructure(id),
          validationService.getValidationErrors(id)
        ]);
        setDocumentStructure(structureData);
        setErrors(errorsData);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleCancelClick = () => {
    setOpenCancelDialog(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await validationService.cancelValidation(id);
      setOpenCancelDialog(false);
      setShowCancelSuccess(true);
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      handleApiError(error);
    }
  };

  if (loading || !validation) return <Loading />;

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          Kembali
        </Button>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownloadOutlined />}
          >
            Unduh DOCX
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PictureAsPdfOutlined />}
          >
            Unduh PDF
          </Button>
        </Stack>
      </Box>

      <StatusBanner status={documentStatus} queuePosition={queuePosition} onCancel={handleCancelClick} />
      
      {(documentStatus === 'Lolos' || documentStatus === 'Tidak Lolos') && hasValidationData && (
        <>
          {documentStatus === 'Tidak Lolos' && <ValidationSummary errorCount={validation?.errorCount || 0} score={validation?.skor || 0} />}
          
          <DocumentStructurePanel documentStructure={documentStructure} expanded={expanded} onExpand={handleChange} />
          
          {errors.length === 0 ? (
            <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '2px solid #10B981', bgcolor: '#ECFDF5', textAlign: 'center' }}>
              <Typography variant="h3" sx={{ mb: 1 }}>🎉</Typography>
              <Typography variant="h5" fontWeight="600" color="#065F46" gutterBottom>Bagus!</Typography>
              <Typography variant="body1" color="#047857">Tidak ada kesalahan yang ditemukan</Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', lg: 'row' }, alignItems: 'stretch' }}>
              <Box sx={{ flex: 1, width: '100%' }}>
                <ErrorListPanel
                  errors={errors}
                  selectedError={selectedError}
                  onSelectError={setSelectedError}
                />
              </Box>

              <Box sx={{ flex: 1, width: '100%' }}>
                <DocumentPreview 
                  selectedError={selectedError} 
                  totalErrors={errors.length}
                  onPrevious={() => setSelectedError(selectedError - 1)}
                  onNext={() => setSelectedError(selectedError + 1)}
                />
              </Box>
            </Box>
          )}
        </>
      )}

      <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
        <DialogTitle>Batalkan Validasi?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin membatalkan validasi dokumen ini? Tindakan ini tidak dapat dibatalkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>Batal</Button>
          <Button onClick={handleConfirmCancel} color="error" variant="contained">
            Ya, Batalkan
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showCancelSuccess}
        autoHideDuration={6000}
        onClose={() => setShowCancelSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowCancelSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Dokumen berhasil dibatalkan!
        </Alert>
      </Snackbar>
    </Stack>
  );
}
