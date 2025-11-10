import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { UploadFileOutlined, Close } from '@mui/icons-material';
import FileUploadArea from '../../shared/ui/FileUploadArea';

export default function CekDokumenDialog({ open, onClose, onSubmit, canUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setFile(null);
    setError(null);
    setLoading(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Pilih file terlebih dahulu');
      return;
    }
    
    console.log('📤 Submitting file:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });
    
    setLoading(true);
    setError(null);
    try {
      await onSubmit(file);
      handleClose();
    } catch (err) {
      console.error('❌ Upload error:', err);
      setError(err.data?.message || err.message || 'Terjadi kesalahan saat upload dokumen');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !file || loading || !canUpload;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box component="span" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Cek Dokumen Baru</Box>
        <Button onClick={handleClose} sx={{ minWidth: 'auto', p: 0.5 }}>
          <Close />
        </Button>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {!canUpload && (
            <Alert severity="warning" sx={{ borderRadius: '12px' }}>
              <Typography fontWeight="medium">Tidak dapat cek dokumen baru</Typography>
              <Typography variant="body2">Anda memiliki dokumen dalam antrian. Batalkan dokumen tersebut terlebih dahulu untuk melanjutkan.</Typography>
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ borderRadius: '12px' }}>
              <Typography variant="body2">{error}</Typography>
            </Alert>
          )}

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Format yang didukung: .docx (Microsoft Word)
            </Typography>
            <FileUploadArea 
              file={file} 
              onFileChange={(e) => {
                const selectedFile = e.target.files[0];
                console.log('📁 File selected:', selectedFile?.name, selectedFile?.size, 'bytes');
                setFile(selectedFile);
              }} 
              disabled={!canUpload} 
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} variant="outlined" disabled={loading}>Batal</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <UploadFileOutlined />} 
          disabled={isDisabled}
        >
          {loading ? 'Mengupload...' : 'Mulai Cek Dokumen'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
