import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';
import { dashboardService, templateService } from '../../../services';
import { TodayOutlined, TimerOutlined, TrendingUpOutlined } from '@mui/icons-material';

export default function SystemInfo() {
  const [systemInfo, setSystemInfo] = useState(null);
  const [activeTemplate, setActiveTemplate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [info, template] = await Promise.all([
          dashboardService.getSystemInfo(),
          templateService.getActiveTemplate()
        ]);
        setSystemInfo(info);
        setActiveTemplate(template);
      } catch (error) {
        console.error('Error fetching system info:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: '300px' }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%' }}>
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
              <Typography variant="body2" fontWeight="600">{systemInfo?.todayValidations || 0} dokumen</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimerOutlined sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">Rata-rata Waktu</Typography>
              </Box>
              <Typography variant="body2" fontWeight="600">{systemInfo?.avgTime || 0} menit</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpOutlined sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">Tingkat Keberhasilan</Typography>
              </Box>
              <Typography variant="body2" fontWeight="600" color="success.main">{systemInfo?.successRate || 0}%</Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
