import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Box, Typography, FormControlLabel, Radio, Alert } from '@mui/material';
import { UploadFileOutlined, Close } from '@mui/icons-material';
import FileUploadArea from '../../shared/ui/FileUploadArea';

export default function CekDokumenDialog({ open, onClose, onSubmit, hasQueuedDoc }) {
  const [file, setFile] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleClose = () => {
    setFile(null);
    setIsConfirmed(false);
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(file);
    handleClose();
  };

  const isDisabled = !file || !isConfirmed || hasQueuedDoc;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">Cek Dokumen Baru</Typography>
        <Button onClick={handleClose} sx={{ minWidth: 'auto', p: 0.5 }}>
          <Close />
        </Button>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {hasQueuedDoc && (
            <Alert severity="warning" sx={{ borderRadius: '12px' }}>
              <Typography fontWeight="medium">Tidak dapat cek dokumen baru</Typography>
              <Typography variant="body2">Anda memiliki dokumen dalam antrian atau sedang diproses. Batalkan dokumen tersebut terlebih dahulu untuk melanjutkan.</Typography>
            </Alert>
          )}

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Format yang didukung: .docx (Microsoft Word)
            </Typography>
            <FileUploadArea file={file} onFileChange={(e) => setFile(e.target.files[0])} disabled={hasQueuedDoc} />
          </Box>

          <Box sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 2, backgroundColor: isConfirmed ? '#F0F5FF' : 'transparent' }}>
            <FormControlLabel
              control={<Radio checked={isConfirmed} onChange={(e) => setIsConfirmed(e.target.checked)} disabled={hasQueuedDoc} />}
              label={
                <Box>
                  <Typography fontWeight="medium">Konfirmasi Keaslian Dokumen</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Saya menyatakan bahwa dokumen ini adalah hasil karya saya sendiri
                  </Typography>
                </Box>
              }
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} variant="outlined">Batal</Button>
        <Button onClick={handleSubmit} variant="contained" startIcon={<UploadFileOutlined />} disabled={isDisabled}>
          Mulai Cek Dokumen
        </Button>
      </DialogActions>
    </Dialog>
  );
}
