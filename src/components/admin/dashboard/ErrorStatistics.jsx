import { Box, Paper, Typography, Stack } from '@mui/material';

export default function ErrorStatistics({ errorStats = [] }) {

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
        {errorStats.map((stat, index) => (
          <Box key={index}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" fontWeight="medium">{stat.name}</Typography>
              <Typography variant="body2" color="text.secondary">{stat.count} kasus ({stat.percentage}%)</Typography>
            </Box>
            <Box sx={{ width: '100%', height: 8, bgcolor: '#E2E8F0', borderRadius: 1, overflow: 'hidden' }}>
              <Box sx={{ width: `${stat.percentage}%`, height: '100%', bgcolor: 'primary.main' }} />
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
