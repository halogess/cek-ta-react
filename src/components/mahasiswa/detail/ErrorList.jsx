import { Paper, Typography, Box, Stack, Chip } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

export default function ErrorList({ errors, selectedError, onSelectError }) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0', flex: 1, minWidth: { xs: '100%', md: '300px' } }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>Daftar Kesalahan</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>Kesalahan format yang ditemukan dalam dokumen</Typography>
      <Box sx={{ maxHeight: '500px', overflowY: 'auto', pr: 1 }}>
        <Stack spacing={2}>
          {errors.map((error, index) => (
            <Paper
              key={index}
              onClick={() => onSelectError(index)}
              sx={{
                p: 2,
                cursor: 'pointer',
                border: selectedError === index ? '3px solid #3B82F6' : '1px solid #E2E8F0',
                borderRadius: '8px',
                bgcolor: selectedError === index ? '#DBEAFE' : 'white',
                transition: 'all 0.2s'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                <Chip label={error.category} size="small" color={error.severity === 'Tinggi' ? 'error' : 'warning'} sx={{ fontWeight: 500 }} />
                <Chip label={error.severity} size="small" color={error.severity === 'Tinggi' ? 'error' : 'warning'} variant="outlined" />
              </Box>
              <Typography fontWeight="600" variant="body2">{error.title}</Typography>
              <Typography variant="caption" color="error" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                <ErrorOutline sx={{ fontSize: 14 }} /> {error.location}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}
