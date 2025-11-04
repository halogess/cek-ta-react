import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Box, Typography, TextField, Alert } from '@mui/material';
import { UploadFileOutlined, Close } from '@mui/icons-material';

export default function ValidasiBukuDialog({ open, onClose, onSubmit, hasQueuedBook }) {
  const [numChapters, setNumChapters] = useState('');
  const [judulBuku, setJudulBuku] = useState('');
  const [files, setFiles] = useState({});

  const totalFiles = numChapters ? parseInt(numChapters) + 2 : 0;
  const chapters = numChapters ? parseInt(numChapters) : 0;

  const handleClose = () => {
    setNumChapters('');
    setJudulBuku('');
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

  const isDisabled = !judulBuku || !numChapters || parseInt(numChapters) < 1 || Object.keys(files).length !== totalFiles || hasQueuedBook;

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

          <TextField
            label="Judul Buku TA"
            value={judulBuku}
            onChange={(e) => setJudulBuku(e.target.value)}
            fullWidth
            disabled={hasQueuedBook}
          />

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
              <Box sx={{ p: 2, backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                <Typography variant="body2" fontWeight="medium" gutterBottom>Cover/Abstrak</Typography>
                <input
                  type="file"
                  accept=".docx"
                  onChange={(e) => handleFileChange('cover', e.target.files[0])}
                  disabled={hasQueuedBook}
                  style={{ width: '100%' }}
                />
              </Box>

              {[...Array(chapters)].map((_, i) => (
                <Box key={i} sx={{ p: 2, backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                  <Typography variant="body2" fontWeight="medium" gutterBottom>BAB {i + 1}</Typography>
                  <input
                    type="file"
                    accept=".docx"
                    onChange={(e) => handleFileChange(`bab${i + 1}`, e.target.files[0])}
                    disabled={hasQueuedBook}
                    style={{ width: '100%' }}
                  />
                </Box>
              ))}

              <Box sx={{ p: 2, backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                <Typography variant="body2" fontWeight="medium" gutterBottom>Daftar Pustaka/Lampiran</Typography>
                <input
                  type="file"
                  accept=".docx"
                  onChange={(e) => handleFileChange('pustaka', e.target.files[0])}
                  disabled={hasQueuedBook}
                  style={{ width: '100%' }}
                />
              </Box>

              <Typography variant="body2" color="text.secondary" textAlign="center">
                {Object.keys(files).length} / {totalFiles} file dipilih
              </Typography>
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
