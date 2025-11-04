import { Paper, Typography, Button, Stack } from '@mui/material';
import { UploadOutlined, MenuBookOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function ValidationActions({ onUpload, hasQueuedDoc }) {
  const navigate = useNavigate();
  
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
      <Typography variant="h6" fontWeight="bold">Pilih Jenis Validasi</Typography>
      <Typography color="text.secondary" sx={{ my: 1 }}>
        Pilih metode validasi sesuai kebutuhan Anda
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button 
          variant="contained" 
          size="large" 
          startIcon={<UploadOutlined />}
          onClick={onUpload}
          disabled={hasQueuedDoc}
          sx={{ flex: 1 }}
        >
          Cek Dokumen
        </Button>
        <Button 
          variant="outlined" 
          size="large" 
          startIcon={<MenuBookOutlined />}
          onClick={() => navigate('/mahasiswa/upload-buku')}
          disabled={hasQueuedDoc}
          sx={{ flex: 1 }}
        >
          Validasi Buku Lengkap
        </Button>
      </Stack>
      {hasQueuedDoc && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          Anda memiliki dokumen dalam antrian atau sedang diproses. Batalkan dokumen dalam antrian atau tunggu hingga proses selesai.
        </Typography>
      )}
    </Paper>
  );
}
