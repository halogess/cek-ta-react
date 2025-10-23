import { Box, Paper, Typography, Stack } from '@mui/material';

export default function ErrorStatistics() {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Kesalahan Terbanyak
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Jenis kesalahan format yang paling sering ditemukan
        </Typography>
      </Box>
      <Stack spacing={2.5}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight="medium">Format Font</Typography>
            <Typography variant="body2" color="text.secondary">234 kasus (35%)</Typography>
          </Box>
          <Box sx={{ width: '100%', height: 8, bgcolor: '#E2E8F0', borderRadius: 1, overflow: 'hidden' }}>
            <Box sx={{ width: '35%', height: '100%', bgcolor: 'primary.main' }} />
          </Box>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight="medium">Spasi Paragraf</Typography>
            <Typography variant="body2" color="text.secondary">189 kasus (28%)</Typography>
          </Box>
          <Box sx={{ width: '100%', height: 8, bgcolor: '#E2E8F0', borderRadius: 1, overflow: 'hidden' }}>
            <Box sx={{ width: '28%', height: '100%', bgcolor: 'primary.main' }} />
          </Box>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight="medium">Margin Halaman</Typography>
            <Typography variant="body2" color="text.secondary">156 kasus (23%)</Typography>
          </Box>
          <Box sx={{ width: '100%', height: 8, bgcolor: '#E2E8F0', borderRadius: 1, overflow: 'hidden' }}>
            <Box sx={{ width: '23%', height: '100%', bgcolor: 'primary.main' }} />
          </Box>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight="medium">Penomoran</Typography>
            <Typography variant="body2" color="text.secondary">94 kasus (14%)</Typography>
          </Box>
          <Box sx={{ width: '100%', height: 8, bgcolor: '#E2E8F0', borderRadius: 1, overflow: 'hidden' }}>
            <Box sx={{ width: '14%', height: '100%', bgcolor: 'primary.main' }} />
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}
