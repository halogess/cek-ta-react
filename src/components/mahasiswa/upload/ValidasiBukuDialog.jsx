import { useState, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Box, Typography, TextField, Alert } from '@mui/material';
import { UploadFileOutlined, Close, AttachFile } from '@mui/icons-material';

export default function ValidasiBukuDialog({ open, onClose, onSubmit, hasQueuedBook, judulBuku }) {
  const [numChapters, setNumChapters] = useState('');
  const [files, setFiles] = useState({});

  const totalFiles = numChapters ? parseInt(numChapters) + 2 : 0;
  const chapters = numChapters ? parseInt(numChapters) : 0;

  const handleClose = () => {
    setNumChapters('');
    setFiles({});
    onClose();
  };

  const handleSubmit = () => {
    onSubmit({ files: Object.values(files), judulBuku, numChapters: parseInt(numChapters) });
    handleClose();
  };

  const handleFileChange = (key, file) => {
    setFiles(prev => ({ ...prev, [key]: file }));
  };

  const handleNumChaptersChange = (e) => {
    setNumChapters(e.target.value);
    setFiles({});
  };

  const isDisabled = !numChapters || parseInt(numChapters) < 1 || Object.keys(files).length !== totalFiles || hasQueuedBook;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">Validasi Buku Lengkap Baru</Typography>
        <Button onClick={handleClose} sx={{ minWidth: 'auto', p: 0.5 }}>
          <Close />
        </Button>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {hasQueuedBook && (
            <Alert severity="warning" sx={{ borderRadius: '12px' }}>
              <Typography fontWeight="medium">Tidak dapat memvalidasi buku baru</Typography>
              <Typography variant="body2">Anda memiliki buku dalam antrian atau sedang diproses. Batalkan validasi buku tersebut terlebih dahulu untuk melanjutkan.</Typography>
            </Alert>
          )}

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Judul Buku TA</Typography>
            <Typography variant="body1" fontWeight="500">{judulBuku || 'Memuat judul...'}</Typography>
          </Box>

          <TextField
            label="Jumlah BAB"
            type="number"
            value={numChapters}
            onChange={handleNumChaptersChange}
            fullWidth
            disabled={hasQueuedBook}
            inputProps={{ min: 1 }}
            helperText={numChapters ? `Total file yang harus divalidasi: ${totalFiles} file` : 'Minimal 1 BAB'}
            error={numChapters !== '' && parseInt(numChapters) < 1}
          />

          {numChapters && (
            <Stack spacing={2}>
              <Box sx={{ 
                p: 2.5, 
                border: '2px solid #E0E7FF', 
                borderRadius: '12px',
                bgcolor: files['cover'] ? '#F0F9FF' : '#FAFAFA',
                transition: 'all 0.2s'
              }}>
                <Typography variant="body1" fontWeight="600" sx={{ mb: 1.5 }}>Cover/Abstrak</Typography>
                <input
                  type="file"
                  accept=".docx"
                  onChange={(e) => handleFileChange('cover', e.target.files[0])}
                  disabled={hasQueuedBook}
                  id="file-cover"
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-cover">
                  <Button
                    component="span"
                    variant="outlined"
                    startIcon={<AttachFile />}
                    disabled={hasQueuedBook}
                    fullWidth
                    sx={{ 
                      justifyContent: 'flex-start', 
                      textTransform: 'none', 
                      py: 1.5,
                      color: files['cover'] ? '#3B82F6' : '#000',
                      borderColor: files['cover'] ? '#3B82F6' : '#000'
                    }}
                  >
                    {files['cover'] ? files['cover'].name : 'Pilih file .docx'}
                  </Button>
                </label>
                {files['cover'] && (
                  <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                    ✓ File berhasil dipilih
                  </Typography>
                )}
              </Box>

              {[...Array(chapters)].map((_, i) => (
                <Box key={i} sx={{ 
                  p: 2.5, 
                  border: '2px solid #E0E7FF', 
                  borderRadius: '12px',
                  bgcolor: files[`bab${i + 1}`] ? '#F0F9FF' : '#FAFAFA',
                  transition: 'all 0.2s'
                }}>
                  <Typography variant="body1" fontWeight="600" sx={{ mb: 1.5 }}>BAB {i + 1}</Typography>
                  <input
                    type="file"
                    accept=".docx"
                    onChange={(e) => handleFileChange(`bab${i + 1}`, e.target.files[0])}
                    disabled={hasQueuedBook}
                    id={`file-bab${i + 1}`}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor={`file-bab${i + 1}`}>
                    <Button
                      component="span"
                      variant="outlined"
                      startIcon={<AttachFile />}
                      disabled={hasQueuedBook}
                      fullWidth
                      sx={{ 
                        justifyContent: 'flex-start', 
                        textTransform: 'none', 
                        py: 1.5,
                        color: files[`bab${i + 1}`] ? '#3B82F6' : '#000',
                        borderColor: files[`bab${i + 1}`] ? '#3B82F6' : '#000'
                      }}
                    >
                      {files[`bab${i + 1}`] ? files[`bab${i + 1}`].name : 'Pilih file .docx'}
                    </Button>
                  </label>
                  {files[`bab${i + 1}`] && (
                    <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                      ✓ File berhasil dipilih
                    </Typography>
                  )}
                </Box>
              ))}

              <Box sx={{ 
                p: 2.5, 
                border: '2px solid #E0E7FF', 
                borderRadius: '12px',
                bgcolor: files['pustaka'] ? '#F0F9FF' : '#FAFAFA',
                transition: 'all 0.2s'
              }}>
                <Typography variant="body1" fontWeight="600" sx={{ mb: 1.5 }}>Daftar Pustaka/Lampiran</Typography>
                <input
                  type="file"
                  accept=".docx"
                  onChange={(e) => handleFileChange('pustaka', e.target.files[0])}
                  disabled={hasQueuedBook}
                  id="file-pustaka"
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-pustaka">
                  <Button
                    component="span"
                    variant="outlined"
                    startIcon={<AttachFile />}
                    disabled={hasQueuedBook}
                    fullWidth
                    sx={{ 
                      justifyContent: 'flex-start', 
                      textTransform: 'none', 
                      py: 1.5,
                      color: files['pustaka'] ? '#3B82F6' : '#000',
                      borderColor: files['pustaka'] ? '#3B82F6' : '#000'
                    }}
                  >
                    {files['pustaka'] ? files['pustaka'].name : 'Pilih file .docx'}
                  </Button>
                </label>
                {files['pustaka'] && (
                  <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                    ✓ File berhasil dipilih
                  </Typography>
                )}
              </Box>

              <Box sx={{ 
                p: 2, 
                bgcolor: Object.keys(files).length === totalFiles ? '#ECFDF5' : '#FEF3C7', 
                borderRadius: '8px',
                border: `1px solid ${Object.keys(files).length === totalFiles ? '#10B981' : '#F59E0B'}`
              }}>
                <Typography variant="body2" fontWeight="600" textAlign="center" color={Object.keys(files).length === totalFiles ? '#065F46' : '#92400E'}>
                  {Object.keys(files).length === totalFiles ? '✓ Semua file sudah dipilih!' : `${Object.keys(files).length} / ${totalFiles} file dipilih`}
                </Typography>
              </Box>
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} variant="outlined">Batal</Button>
        <Button onClick={handleSubmit} variant="contained" startIcon={<UploadFileOutlined />} disabled={isDisabled}>
          Mulai Validasi Buku
        </Button>
      </DialogActions>
    </Dialog>
  );
}
