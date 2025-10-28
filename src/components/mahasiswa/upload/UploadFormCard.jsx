import { Paper, Typography, Box, Button, Stack, Radio, FormControlLabel, Alert } from '@mui/material';
import { UploadFileOutlined } from '@mui/icons-material';
import FileUploadArea from '../../shared/ui/FileUploadArea';

export default function UploadFormCard({ 
  file, 
  onFileChange, 
  isConfirmed, 
  onConfirmChange, 
  onUpload, 
  isDisabled, 
  hasQueuedDoc, 
  uploadSuccess 
}) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" fontWeight="bold">Pilih Dokumen</Typography>
          <Typography color="text.secondary">Format yang didukung: .docx (Microsoft Word)</Typography>
        </Box>

        {hasQueuedDoc && (
          <Alert severity="error" sx={{ borderRadius: '12px' }}>
            <Typography fontWeight="medium">Tidak dapat mengunggah dokumen baru</Typography>
            <Typography variant="body2">Anda memiliki dokumen dalam antrian atau sedang diproses. Batalkan dokumen dalam antrian atau tunggu hingga proses selesai.</Typography>
          </Alert>
        )}

        {uploadSuccess && (
          <Alert severity="success" sx={{ borderRadius: '12px' }}>
            <Typography fontWeight="medium">Dokumen berhasil diunggah!</Typography>
            <Typography variant="body2">Proses validasi akan dimulai. Anda akan menerima notifikasi setelah selesai.</Typography>
          </Alert>
        )}

        <FileUploadArea file={file} onFileChange={onFileChange} disabled={hasQueuedDoc} />

        <Box sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', p: 2, backgroundColor: isConfirmed ? '#F0F5FF' : 'transparent' }}>
          <FormControlLabel
            control={<Radio checked={isConfirmed} onChange={(e) => onConfirmChange(e.target.checked)} disabled={hasQueuedDoc} />}
            label={
              <Box>
                <Typography fontWeight="medium">Konfirmasi Keaslian Dokumen</Typography>
                <Typography variant="body2" color="text.secondary">
                  Saya menyatakan bahwa dokumen ini adalah hasil karya saya sendiri dan belum pernah divalidasi sebelumnya
                </Typography>
              </Box>
            }
          />
        </Box>

        <Button
          variant="contained"
          size="large"
          startIcon={<UploadFileOutlined />}
          disabled={isDisabled}
          onClick={onUpload}
          sx={{ backgroundColor: isDisabled ? '#A5B4FC' : 'primary.main' }}
        >
          Mulai Validasi
        </Button>
      </Stack>
    </Paper>
  );
}
