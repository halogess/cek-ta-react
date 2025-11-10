import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stack, Paper, Typography, Button, Box } from '@mui/material';
import Loading from '../../components/shared/ui/Loading';
import DocumentStructurePanel from '../../components/mahasiswa/detail/DocumentStructurePanel';
import DocumentPreview from '../../components/mahasiswa/detail/DocumentPreview';
import { ArrowBack, FileDownloadOutlined, PictureAsPdfOutlined, DownloadOutlined } from '@mui/icons-material';
import { useHeader } from '../../context/HeaderContext';
import ValidationSummary from '../../components/mahasiswa/validation/ValidationSummary';
import ErrorListPanel from '../../components/mahasiswa/detail/ErrorListPanel';
import { validationService, handleApiError } from '../../services';
import { useWebSocket } from '../../hooks/useWebSocket';


const DetailValidation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeaderInfo } = useHeader();
  const [expanded, setExpanded] = useState(false);
  const [selectedError, setSelectedError] = useState(-1);
  
  const [validation, setValidation] = useState(null);
  const [documentStructure, setDocumentStructure] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { subscribe } = useWebSocket();
  const isPassedValidation = validation?.isPassedValidation || false;
  const documentStatus = validation?.status || '';
  const hasValidationData = validation?.errorCount !== null && validation?.skor !== null;

  useEffect(() => {
    setHeaderInfo({ title: 'Detail Validasi' });
    fetchValidation();
    window.scrollTo(0, 0);
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo, id]);

  useEffect(() => {
    const unsubscribeStatus = subscribe('validation_status', (data) => {
      if (data.dokumen_id === parseInt(id)) {
        console.log('📨 Admin: Status changed');
        const statusMap = {
          'dalam_antrian': 'Dalam Antrian',
          'diproses': 'Diproses',
          'lolos': 'Lolos',
          'tidak_lolos': 'Tidak Lolos'
        };
        setValidation(prev => ({ ...prev, status: statusMap[data.status] || data.status }));
      }
    });

    const unsubscribeComplete = subscribe('validation_complete', (data) => {
      if (data.dokumen_id === parseInt(id)) {
        console.log('📨 Admin: Validation complete');
        fetchValidation();
      }
    });

    return () => {
      unsubscribeStatus();
      unsubscribeComplete();
    };
  }, [subscribe, id]);

  const fetchValidation = async () => {
    try {
      setLoading(true);
      const data = await validationService.getValidationById(id);
      console.log('Validation data:', data);
      setValidation(data);
      
      if (data.errorCount !== null && data.skor !== null) {
        const [structureData, errorsData] = await Promise.all([
          validationService.getDocumentStructure(id),
          validationService.getValidationErrors(id)
        ]);
        console.log('Structure data:', structureData);
        console.log('Structure length:', structureData.length);
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

  if (loading || !validation) return <Loading />;

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/admin/history')}>
          Kembali
        </Button>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" startIcon={<FileDownloadOutlined />}>
            Unduh ZIP
          </Button>
          <Button variant="outlined" size="small" startIcon={<PictureAsPdfOutlined />}>
            Unduh PDF
          </Button>
        </Stack>
      </Box>

      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Informasi Mahasiswa
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Nama</Typography>
            <Typography variant="body1" fontWeight="500">{validation?.nama}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">NRP</Typography>
            <Typography variant="body1" fontWeight="500">{validation?.nrp}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Jurusan</Typography>
            <Typography variant="body1" fontWeight="500">{validation?.jurusan}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Judul {validation?.type === 'book' ? 'Buku' : 'TA'}</Typography>
            <Typography variant="body1" fontWeight="500">{validation?.judulTA || validation?.judulBuku}</Typography>
          </Box>
        </Box>
      </Paper>

      {isPassedValidation && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #10B981', bgcolor: '#ECFDF5' }}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h6" fontWeight="600" color="#065F46" gutterBottom>
                Dokumen Lulus Validasi
              </Typography>
              <Typography variant="body2" color="#047857">
                Dokumen telah memenuhi semua persyaratan format.
              </Typography>
            </Box>
            <Button variant="contained" color="success" startIcon={<DownloadOutlined />}>
              Download Sertifikat
            </Button>
          </Stack>
        </Paper>
      )}

      {documentStatus === 'Dalam Antrian' && (
        <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #DBEAFE', bgcolor: '#EFF6FF', textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Dokumen Dalam Antrian
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dokumen sedang menunggu untuk diproses
          </Typography>
        </Paper>
      )}

      {documentStatus === 'Diproses' && (
        <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #FEF3C7', bgcolor: '#FFFBEB', textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Dokumen Sedang Diproses
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sistem sedang memvalidasi dokumen
          </Typography>
        </Paper>
      )}

      {documentStatus === 'Dibatalkan' && (
        <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #E5E7EB', bgcolor: '#F9FAFB', textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Dokumen Dibatalkan
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Validasi dokumen telah dibatalkan
          </Typography>
        </Paper>
      )}

      {(documentStatus === 'Lolos' || documentStatus === 'Tidak Lolos') && hasValidationData && (
        <>
          {!isPassedValidation && <ValidationSummary errorCount={validation?.errorCount || 0} score={validation?.skor || 0} />}
          
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
                <ErrorListPanel errors={errors} selectedError={selectedError} onSelectError={setSelectedError} showRecommendations={false} />
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
    </Stack>
  );
};

export default DetailValidation;
