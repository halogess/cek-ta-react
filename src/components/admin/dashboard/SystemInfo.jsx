import { Box, Paper, Typography, Button, Stack } from '@mui/material';
import { TodayOutlined, TimerOutlined, TrendingUpOutlined } from '@mui/icons-material';

export default function SystemInfo() {
  return (
    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: '300px' }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%' }}>
          <Typography variant="h6" fontWeight="600">
            Versi Panduan Aktif
          </Typography>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              v2.1.0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Diperbarui: 15 Jan 2024
            </Typography>
            <Button variant="outlined" sx={{ mt: 2, borderRadius: '8px' }}>
              Lihat Detail
            </Button>
          </Box>
        </Paper>
      </Box>
      <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: '300px' }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%' }}>
          <Typography variant="h6" fontWeight="600">
            Aktivitas Sistem
          </Typography>
          <Stack spacing={2} sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TodayOutlined sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">Validasi Hari Ini</Typography>
              </Box>
              <Typography variant="body2" fontWeight="600">47 dokumen</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimerOutlined sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">Rata-rata Waktu</Typography>
              </Box>
              <Typography variant="body2" fontWeight="600">3.2 menit</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpOutlined sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">Tingkat Keberhasilan</Typography>
              </Box>
              <Typography variant="body2" fontWeight="600" color="success.main">71.5%</Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
