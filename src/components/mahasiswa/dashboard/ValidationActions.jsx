import { Paper, Typography, Button } from '@mui/material';
import { UploadOutlined } from '@mui/icons-material';

export default function ValidationActions({ onUpload, hasQueuedDoc }) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
      <Typography variant="h6" fontWeight="bold">Validasi Dokumen Baru</Typography>
      <Typography color="text.secondary" sx={{ my: 1 }}>
        Unggah dokumen tugas akhir atau tesis Anda untuk divalidasi
      </Typography>
      <Button 
        variant="contained" 
        size="large" 
        startIcon={<UploadOutlined />}
        onClick={onUpload}
        disabled={hasQueuedDoc}
      >
        Mulai Validasi
      </Button>
      {hasQueuedDoc && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          Anda memiliki dokumen dalam antrian atau sedang diproses. Batalkan dokumen dalam antrian atau tunggu hingga proses selesai.
        </Typography>
      )}
    </Paper>
  );
}
