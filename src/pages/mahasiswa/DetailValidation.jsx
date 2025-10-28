import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stack, Paper, Typography, Button, Box, Accordion, AccordionSummary, AccordionDetails, Chip, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { ArrowBack, ExpandMore, DescriptionOutlined, NavigateBefore, NavigateNext, DownloadOutlined, CheckOutlined, HourglassEmptyOutlined, CancelOutlined, BlockOutlined, FileDownloadOutlined, PictureAsPdfOutlined } from '@mui/icons-material';
import { useHeader } from '../../context/HeaderContext';
import ValidationSummary from '../../components/mahasiswa/validation/ValidationSummary';
import ErrorListPanel from '../../components/mahasiswa/detail/ErrorListPanel';
import { getValidationById } from '../../data/mockData';
import { documentStructure, errors } from '../../data/validationData';

export default function DetailValidation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeaderInfo } = useHeader();
  const [expanded, setExpanded] = useState(false);
  const [selectedError, setSelectedError] = useState(-1);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  
  const validation = getValidationById(id);
  const documentStatus = validation?.status === 'Lolos' || validation?.status === 'Tidak Lolos' ? 'Selesai' : validation?.status || 'Selesai';
  const isPassedValidation = validation?.isPassedValidation || false;
  const queuePosition = validation?.queuePosition || 0;

  useEffect(() => {
    setHeaderInfo({ title: 'Detail Validasi' });
    window.scrollTo(0, 0);
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleCancelClick = () => {
    setOpenCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    setOpenCancelDialog(false);
    setShowCancelSuccess(true);
    setTimeout(() => navigate(-1), 1500);
  };

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

      {documentStatus === 'Selesai' && (
        <>
          {isPassedValidation && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #10B981', bgcolor: '#ECFDF5' }}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" fontWeight="600" color="#065F46" gutterBottom>
                    Selamat! Dokumen Anda Lulus Validasi
                  </Typography>
                  <Typography variant="body2" color="#047857">
                    Dokumen Anda telah memenuhi semua persyaratan format. Unduh sertifikat validasi Anda.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<DownloadOutlined />}
                >
                  Download Sertifikat
                </Button>
              </Stack>
            </Paper>
          )}
          
          {!isPassedValidation && <ValidationSummary errorCount={validation?.errorCount || 0} score={validation?.skor || 0} />}
        </>
      )}

      {/* Document Structure */}
      {documentStatus !== 'Dalam Antrian' && documentStatus !== 'Dibatalkan' && (
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
                      {Object.entries(chapter.pengantarStats).map(([key, value]) => {
                        const colors = {
                          Paragraf: { bg: '#DBEAFE', text: '#1E40AF' },
                        };
                        const color = colors[key] || { bg: '#F3F4F6', text: '#374151' };
                        return (
                          <Chip
                            key={key}
                            label={`${key}: ${value}`}
                            size="small"
                            sx={{
                              bgcolor: color.bg,
                              color: color.text,
                              fontWeight: 500,
                              border: 'none'
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                )}
                {chapter.sections.map((section, sIdx) => (
                  <Box key={sIdx} sx={{ p: 1.5, bgcolor: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" fontWeight="600" gutterBottom sx={{ display: 'block' }}>{section.title}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {Object.entries(section.stats).map(([key, value]) => {
                        const colors = {
                          Paragraf: { bg: '#DBEAFE', text: '#1E40AF' },
                          Caption: { bg: '#FCE7F3', text: '#9F1239' },
                          Footnote: { bg: '#FEF3C7', text: '#92400E' },
                          Formula: { bg: '#E9D5FF', text: '#6B21A8' },
                          'List-item': { bg: '#D1FAE5', text: '#065F46' },
                          Gambar: { bg: '#FED7AA', text: '#9A3412' },
                          Judul: { bg: '#E0E7FF', text: '#3730A3' },
                          Tabel: { bg: '#CCFBF1', text: '#115E59' },
                        };
                        const color = colors[key] || { bg: '#F3F4F6', text: '#374151' };
                        return (
                          <Chip
                            key={key}
                            label={`${key}: ${value}`}
                            size="small"
                            sx={{
                              bgcolor: color.bg,
                              color: color.text,
                              fontWeight: 500,
                              border: 'none'
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                ))}
                {chapter.penutupStats && (
                  <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" fontWeight="600" gutterBottom sx={{ display: 'block' }}>Penutup Bab</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {Object.entries(chapter.penutupStats).map(([key, value]) => {
                        const colors = {
                          Paragraf: { bg: '#DBEAFE', text: '#1E40AF' },
                        };
                        const color = colors[key] || { bg: '#F3F4F6', text: '#374151' };
                        return (
                          <Chip
                            key={key}
                            label={`${key}: ${value}`}
                            size="small"
                            sx={{
                              bgcolor: color.bg,
                              color: color.text,
                              fontWeight: 500,
                              border: 'none'
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
      )}

      {documentStatus === 'Dibatalkan' && (
        <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #FEE2E2', bgcolor: '#FEF2F2', textAlign: 'center' }}>
          <BlockOutlined sx={{ fontSize: 64, color: '#EF4444', mb: 2 }} />
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Validasi Dibatalkan
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Validasi dokumen ini telah dibatalkan
          </Typography>
        </Paper>
      )}

      {documentStatus === 'Dalam Antrian' && (
        <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
          <HourglassEmptyOutlined sx={{ fontSize: 64, color: '#3B82F6', mb: 2 }} />
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Dokumen Dalam Antrian
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Mohon tunggu, Anda berada di antrian ke-{queuePosition}
          </Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelOutlined />}
            onClick={handleCancelClick}
          >
            Batalkan Validasi
          </Button>
        </Paper>
      )}

      {documentStatus === 'Menunggu Konfirmasi' && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Konfirmasi Struktur Dokumen
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Struktur dokumen telah diidentifikasi. Silakan konfirmasi jika sudah sesuai untuk melanjutkan proses validasi.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<CheckOutlined />}
              sx={{ alignSelf: 'flex-start' }}
            >
              Konfirmasi Struktur
            </Button>
          </Stack>
        </Paper>
      )}

      {documentStatus === 'Selesai' && (
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', lg: 'row' }, alignItems: 'stretch' }}>
        {/* Daftar Kesalahan dengan Rekomendasi */}
        <Box sx={{ flex: 1, width: '100%' }}>
          <ErrorListPanel
            errors={errors}
            selectedError={selectedError}
            onSelectError={setSelectedError}
          />
        </Box>

        {/* Pratinjau Dokumen */}
        <Box sx={{ flex: 1, width: '100%' }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight="600">Pratinjau Dokumen</Typography>
                <Typography variant="caption" color="text.secondary">Area bermasalah ditandai highlight merah</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  disabled={selectedError === -1 || selectedError === 0}
                  onClick={() => setSelectedError(selectedError - 1)}
                  startIcon={<NavigateBefore />}
                  sx={{ minWidth: '70px', fontSize: '0.75rem' }}
                >
                  Previous
                </Button>
                <Button 
                  variant="outlined" 
                  size="small"
                  disabled={selectedError === -1 || selectedError === errors.length - 1}
                  onClick={() => setSelectedError(selectedError + 1)}
                  endIcon={<NavigateNext />}
                  sx={{ minWidth: '70px', fontSize: '0.75rem' }}
                >
                  Next
                </Button>
              </Box>
            </Box>
            <Box sx={{ 
              minHeight: '450px', 
              bgcolor: '#F8FAFC', 
              borderRadius: '12px', 
              border: '2px dashed #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 1.5
            }}>
              <DescriptionOutlined sx={{ fontSize: 48, color: '#94A3B8' }} />
              <Typography variant="body2" color="text.secondary">
                {selectedError === -1 ? 'Pilih kesalahan untuk melihat pratinjau' : 'Pratinjau dokumen akan ditampilkan di sini'}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
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
