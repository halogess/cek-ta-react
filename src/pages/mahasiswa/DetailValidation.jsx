import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stack, Paper, Typography, Button, Box, Accordion, AccordionSummary, AccordionDetails, Chip, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { ArrowBack, ExpandMore, DescriptionOutlined, NavigateBefore, NavigateNext, DownloadOutlined, CheckOutlined, HourglassEmptyOutlined, CancelOutlined, BlockOutlined, FileDownloadOutlined, PictureAsPdfOutlined } from '@mui/icons-material';
import { useHeader } from '../../context/HeaderContext';
import ValidationSummary from '../../components/mahasiswa/validation/ValidationSummary';
import ErrorListPanel from '../../components/mahasiswa/detail/ErrorListPanel';

const documentStructure = [
  {
    chapter: 'BAB I PENDAHULUAN',
    pengantarStats: { Paragraf: 2 },
    sections: [
      { title: '1.1 Latar Belakang', stats: { Paragraf: 45, Footnote: 2, Judul: 3, 'List-item': 2, Tabel: 1, Gambar: 1, Caption: 1, Formula: 1 } },
      { title: '1.2 Rumusan Masalah', stats: { Paragraf: 12, 'List-item': 5, Judul: 2, Footnote: 1, Tabel: 1 } },
      { title: '1.3 Tujuan Penelitian', stats: { Paragraf: 8, 'List-item': 3, Judul: 1, Gambar: 1, Caption: 1 } },
      { title: '1.4 Manfaat Penelitian', stats: { Paragraf: 10, Judul: 2, 'List-item': 2, Footnote: 1 } },
    ],
    penutupStats: { Paragraf: 1 }
  },
  {
    chapter: 'BAB II TINJAUAN PUSTAKA',
    pengantarStats: { Paragraf: 5 },
    sections: [
      { title: '2.1 Landasan Teori', stats: { Paragraf: 56, Tabel: 2, Gambar: 3, Caption: 3, Formula: 5, Judul: 4, Footnote: 3, 'List-item': 4 } },
      { title: '2.2 Penelitian Terdahulu', stats: { Paragraf: 34, Tabel: 1, Footnote: 4, Judul: 3, Gambar: 2, Caption: 2, Formula: 1, 'List-item': 2 } },
      { title: '2.3 Kerangka Pemikiran', stats: { Paragraf: 20, Gambar: 1, Caption: 1, Formula: 2, Judul: 2, Tabel: 1, Footnote: 1, 'List-item': 1 } },
    ],
    penutupStats: { Paragraf: 2 }
  },
  {
    chapter: 'BAB III METODOLOGI PENELITIAN',
    pengantarStats: { Paragraf: 3 },
    sections: [
      { title: '3.1 Desain Penelitian', stats: { Paragraf: 15, Gambar: 2, Caption: 2, Judul: 2, Tabel: 1, Formula: 1, Footnote: 1, 'List-item': 3 } },
      { title: '3.2 Populasi dan Sampel', stats: { Paragraf: 12, Tabel: 2, Formula: 3, Judul: 1, Gambar: 1, Caption: 1, Footnote: 2, 'List-item': 2 } },
    ],
    penutupStats: { Paragraf: 1 }
  },
  {
    chapter: 'BAB IV HASIL DAN PEMBAHASAN',
    pengantarStats: { Paragraf: 4 },
    sections: [
      { title: '4.1 Hasil Penelitian', stats: { Paragraf: 40, Tabel: 5, Gambar: 4, Caption: 9, Formula: 3, Judul: 3, Footnote: 2, 'List-item': 5 } },
      { title: '4.2 Pembahasan', stats: { Paragraf: 35, Gambar: 3, Caption: 3, Tabel: 2, Formula: 2, Judul: 2, Footnote: 3, 'List-item': 2 } },
    ],
    penutupStats: { Paragraf: 2 }
  },
  {
    chapter: 'BAB V KESIMPULAN DAN SARAN',
    pengantarStats: { Paragraf: 2 },
    sections: [
      { title: '5.1 Kesimpulan', stats: { Paragraf: 8, 'List-item': 5, Judul: 1 } },
      { title: '5.2 Saran', stats: { Paragraf: 6, 'List-item': 4, Judul: 1 } },
    ],
    penutupStats: { Paragraf: 1 }
  },
];

export default function DetailValidation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeaderInfo } = useHeader();
  const [expanded, setExpanded] = useState(false);
  const [selectedError, setSelectedError] = useState(-1);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  
  // Data dokumen berdasarkan ID (sinkron dengan Dashboard)
  const documentData = {
    1: { status: 'Dalam Antrian', isPassedValidation: false, queuePosition: 3 },
    2: { status: 'Menunggu Konfirmasi', isPassedValidation: false, queuePosition: 0 },
    3: { status: 'Selesai', isPassedValidation: true, queuePosition: 0 },
    4: { status: 'Selesai', isPassedValidation: false, queuePosition: 0 },
    5: { status: 'Dibatalkan', isPassedValidation: false, queuePosition: 0 },
    6: { status: 'Selesai', isPassedValidation: false, queuePosition: 0 },
    7: { status: 'Menunggu Konfirmasi', isPassedValidation: false, queuePosition: 0 },
    8: { status: 'Selesai', isPassedValidation: false, queuePosition: 0 },
    9: { status: 'Selesai', isPassedValidation: false, queuePosition: 0 },
    10: { status: 'Menunggu Konfirmasi', isPassedValidation: false, queuePosition: 0 },
    11: { status: 'Selesai', isPassedValidation: false, queuePosition: 0 },
  };
  
  const currentDoc = documentData[id] || { status: 'Selesai', isPassedValidation: false, queuePosition: 0 };
  const documentStatus = currentDoc.status;
  const isPassedValidation = currentDoc.isPassedValidation;
  const queuePosition = currentDoc.queuePosition;

  const errors = [
    {
      category: 'Font',
      severity: 'Tinggi',
      title: 'Font tidak sesuai. Menggunakan Arial, seharusnya Times New Roman',
      location: 'Subbab 1.2.1, Halaman 3, Paragraf 2',
      steps: [
        'Pilih seluruh teks di subbab 1.2.1 halaman 3 paragraf 2',
        'Ubah font menjadi Times New Roman ukuran 12pt',
        'Pastikan heading menggunakan Times New Roman bold'
      ],
      tips: 'Gunakan fitur "Find & Replace" di Microsoft Word untuk mengubah font secara serentak. Atur format paragraph untuk mengatur spasi.'
    },
    {
      category: 'Spasi',
      severity: 'Sedang',
      title: 'Spasi antar baris tidak konsisten (1.2 seharusnya 1.5)',
      location: 'Subbab 2.1, Halaman 8, Paragraf 5',
      steps: [
        'Pilih paragraf yang bermasalah',
        'Buka Format > Paragraph',
        'Ubah line spacing menjadi 1.5'
      ],
      tips: 'Gunakan Styles di Word untuk memastikan konsistensi spasi di seluruh dokumen.'
    },
    {
      category: 'Margin',
      severity: 'Tinggi',
      title: 'Margin kiri 2.5 cm, seharusnya 3 cm',
      location: 'Seluruh dokumen',
      steps: [
        'Buka Layout > Margins',
        'Pilih Custom Margins',
        'Ubah margin kiri menjadi 3 cm'
      ],
      tips: 'Periksa margin di setiap section untuk memastikan konsistensi.'
    },
    {
      category: 'Indentasi',
      severity: 'Sedang',
      title: 'Indentasi paragraf tidak sesuai (0.5 cm seharusnya 1 cm)',
      location: 'Subbab 1.1, Halaman 2, Paragraf 1-5',
      steps: [
        'Pilih paragraf yang bermasalah',
        'Klik kanan > Paragraph',
        'Ubah First Line Indent menjadi 1 cm'
      ],
      tips: 'Gunakan ruler untuk melihat indentasi dengan lebih jelas.'
    },
    {
      category: 'Penomoran',
      severity: 'Tinggi',
      title: 'Penomoran halaman tidak konsisten',
      location: 'Halaman 15-20',
      steps: [
        'Buka Insert > Page Number',
        'Pilih Format Page Numbers',
        'Pastikan Continue from previous section dipilih'
      ],
      tips: 'Periksa section breaks yang mungkin mempengaruhi penomoran.'
    },
    {
      category: 'Tabel',
      severity: 'Sedang',
      title: 'Caption tabel tidak sesuai format',
      location: 'Tabel 2.1, Halaman 12',
      steps: [
        'Klik kanan pada tabel',
        'Pilih Insert Caption',
        'Gunakan format "Tabel [nomor]. [judul]"'
      ],
      tips: 'Gunakan fitur Cross-reference untuk referensi tabel otomatis.'
    },
    {
      category: 'Gambar',
      severity: 'Sedang',
      title: 'Resolusi gambar terlalu rendah',
      location: 'Gambar 3.2, Halaman 25',
      steps: [
        'Hapus gambar yang ada',
        'Insert gambar dengan resolusi minimal 300 DPI',
        'Pastikan ukuran gambar sesuai dengan layout'
      ],
      tips: 'Simpan gambar dalam format PNG atau JPEG dengan kualitas tinggi.'
    },
    {
      category: 'Referensi',
      severity: 'Tinggi',
      title: 'Format referensi tidak konsisten',
      location: 'Daftar Pustaka, Halaman 45-48',
      steps: [
        'Periksa setiap entri referensi',
        'Sesuaikan dengan format APA/IEEE yang dipilih',
        'Pastikan urutan alfabetis'
      ],
      tips: 'Gunakan reference manager seperti Mendeley atau Zotero untuk konsistensi.'
    }
  ];

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
          
          {!isPassedValidation && <ValidationSummary errorCount={8} score={75} />}
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
