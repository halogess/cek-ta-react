import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stack, Paper, Typography, Button, Box, Accordion, AccordionSummary, AccordionDetails, Chip } from '@mui/material';
import { ArrowBack, ExpandMore, DescriptionOutlined, NavigateBefore, NavigateNext, FileDownloadOutlined, PictureAsPdfOutlined, DownloadOutlined } from '@mui/icons-material';
import { useHeader } from '../../context/HeaderContext';
import ValidationSummary from '../../components/mahasiswa/validation/ValidationSummary';
import ErrorListPanel from '../../components/mahasiswa/detail/ErrorListPanel';
import { getValidationById } from '../../data/mockData';
import { documentStructure, errors } from '../../data/validationData';

const DetailValidation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeaderInfo } = useHeader();
  const [expanded, setExpanded] = useState(false);
  const [selectedError, setSelectedError] = useState(-1);
  
  const validation = getValidationById(id);
  const isPassedValidation = validation?.isPassedValidation || false;

  useEffect(() => {
    setHeaderInfo({ title: 'Detail Validasi' });
    window.scrollTo(0, 0);
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/admin/history')}>
          Kembali
        </Button>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" startIcon={<FileDownloadOutlined />}>
            Unduh DOCX
          </Button>
          <Button variant="outlined" size="small" startIcon={<PictureAsPdfOutlined />}>
            Unduh PDF
          </Button>
        </Stack>
      </Box>

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

      {!isPassedValidation && <ValidationSummary errorCount={validation?.errorCount || 0} score={validation?.skor || 0} />}

      <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <DescriptionOutlined color="primary" sx={{ fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight="600">Struktur Dokumen</Typography>
        </Box>

        {documentStructure.map((chapter, index) => (
          <Accordion 
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            sx={{ mb: 1, '&:before': { display: 'none' }, boxShadow: 'none', border: '1px solid #E2E8F0', borderRadius: '12px !important' }}
          >
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ minHeight: 'auto', '& .MuiAccordionSummary-content': { my: 1 } }}>
              <Typography variant="body2" fontWeight="600">{chapter.chapter}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ bgcolor: '#F9FAFB' }}>
              <Stack spacing={2}>
                {chapter.pengantarStats && (
                  <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" fontWeight="600" gutterBottom sx={{ display: 'block' }}>Pengantar Bab</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {Object.entries(chapter.pengantarStats).map(([key, value]) => (
                        <Chip key={key} label={`${key}: ${value}`} size="small" sx={{ bgcolor: '#DBEAFE', color: '#1E40AF', fontWeight: 500, border: 'none' }} />
                      ))}
                    </Box>
                  </Box>
                )}
                {chapter.sections.map((section, sIdx) => (
                  <Box key={sIdx} sx={{ p: 1.5, bgcolor: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" fontWeight="600" gutterBottom sx={{ display: 'block' }}>{section.title}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {Object.entries(section.stats).map(([key, value]) => (
                        <Chip key={key} label={`${key}: ${value}`} size="small" sx={{ bgcolor: '#DBEAFE', color: '#1E40AF', fontWeight: 500, border: 'none' }} />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', lg: 'row' }, alignItems: 'stretch' }}>
        <Box sx={{ flex: 1, width: '100%' }}>
          <ErrorListPanel errors={errors} selectedError={selectedError} onSelectError={setSelectedError} showRecommendations={false} />
        </Box>

        <Box sx={{ flex: 1, width: '100%' }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight="600">Pratinjau Dokumen</Typography>
                <Typography variant="caption" color="text.secondary">Area bermasalah ditandai highlight merah</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Button variant="outlined" size="small" disabled={selectedError === -1 || selectedError === 0} onClick={() => setSelectedError(selectedError - 1)} startIcon={<NavigateBefore />} sx={{ minWidth: '70px', fontSize: '0.75rem' }}>
                  Previous
                </Button>
                <Button variant="outlined" size="small" disabled={selectedError === -1 || selectedError === errors.length - 1} onClick={() => setSelectedError(selectedError + 1)} endIcon={<NavigateNext />} sx={{ minWidth: '70px', fontSize: '0.75rem' }}>
                  Next
                </Button>
              </Box>
            </Box>
            <Box sx={{ minHeight: '450px', bgcolor: '#F8FAFC', borderRadius: '12px', border: '2px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1.5 }}>
              <DescriptionOutlined sx={{ fontSize: 48, color: '#94A3B8' }} />
              <Typography variant="body2" color="text.secondary">
                {selectedError === -1 ? 'Pilih kesalahan untuk melihat pratinjau' : 'Pratinjau dokumen akan ditampilkan di sini'}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Stack>
  );
};

export default DetailValidation;
