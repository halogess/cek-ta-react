import { Paper, Typography, Box, Stack, Button } from '@mui/material';
import { DownloadOutlined, HourglassEmptyOutlined, BlockOutlined, CancelOutlined } from '@mui/icons-material';

export default function StatusBanner({ status, queuePosition, onCancel, onDownload }) {
  if (status === 'Lolos') {
    return (
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
          <Button variant="contained" color="success" startIcon={<DownloadOutlined />} onClick={onDownload}>
            Download Sertifikat
          </Button>
        </Stack>
      </Paper>
    );
  }

  if (status === 'Dibatalkan') {
    return (
      <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #FEE2E2', bgcolor: '#FEF2F2', textAlign: 'center' }}>
        <BlockOutlined sx={{ fontSize: 64, color: '#EF4444', mb: 2 }} />
        <Typography variant="h6" fontWeight="600" gutterBottom>Validasi Dibatalkan</Typography>
        <Typography variant="body2" color="text.secondary">Validasi dokumen ini telah dibatalkan</Typography>
      </Paper>
    );
  }

  if (status === 'Dalam Antrian') {
    return (
      <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #DBEAFE', bgcolor: '#EFF6FF', textAlign: 'center' }}>
        <HourglassEmptyOutlined sx={{ fontSize: 64, color: '#3B82F6', mb: 2 }} />
        <Typography variant="h6" fontWeight="600" gutterBottom>Dokumen Dalam Antrian</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Mohon tunggu, Anda berada di antrian ke-{queuePosition}
        </Typography>
        <Button variant="outlined" color="error" startIcon={<CancelOutlined />} onClick={onCancel}>
          Batalkan Validasi
        </Button>
      </Paper>
    );
  }

  if (status === 'Diproses') {
    return (
      <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #FEF3C7', bgcolor: '#FFFBEB', textAlign: 'center' }}>
        <HourglassEmptyOutlined sx={{ fontSize: 64, color: '#F59E0B', mb: 2 }} />
        <Typography variant="h6" fontWeight="600" gutterBottom>Dokumen Sedang Diproses</Typography>
        <Typography variant="body2" color="text.secondary">
          Sistem sedang memvalidasi dokumen Anda. Mohon tunggu beberapa saat.
        </Typography>
      </Paper>
    );
  }

  return null;
}
