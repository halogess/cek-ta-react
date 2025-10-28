import { Box, Paper, Typography, Button } from '@mui/material';

export default function SystemInfo({ activeTemplate }) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
      <Typography variant="h6" fontWeight="600">
        Versi Panduan Aktif
      </Typography>
      <Box>
        <Typography variant="h4" fontWeight="bold">
          {activeTemplate?.version || '-'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Diperbarui: {activeTemplate?.date || '-'}
        </Typography>
        <Button variant="outlined" sx={{ mt: 2, borderRadius: '8px' }}>
          Lihat Detail
        </Button>
      </Box>
    </Paper>
  );
}
