import { Paper, Typography, Box, Stack } from '@mui/material';
import { LightbulbOutlined, ErrorOutline } from '@mui/icons-material';

export default function RecommendationPanel({ error }) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0', flex: 1.5, minWidth: { xs: '100%', md: '400px' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <LightbulbOutlined color="primary" />
        <Typography variant="h6" fontWeight="bold">Rekomendasi Perbaikan</Typography>
      </Box>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Langkah-langkah untuk memperbaiki dokumen</Typography>

      <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: '8px', mb: 3 }}>
        <Typography variant="body2" fontWeight="600" gutterBottom>Kesalahan Terpilih:</Typography>
        <Typography color="text.secondary">{error.title}</Typography>
        <Typography variant="caption" color="error" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          <ErrorOutline sx={{ fontSize: 14 }} /> {error.location}
        </Typography>
      </Box>

      <Stack spacing={2}>
        {error.steps.map((step, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: '#3B82F6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                flexShrink: 0
              }}
            >
              {index + 1}
            </Box>
            <Typography>{step}</Typography>
          </Box>
        ))}
      </Stack>

      <Box sx={{ mt: 3, p: 2, bgcolor: '#EFF6FF', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <LightbulbOutlined sx={{ color: '#3B82F6', fontSize: 20 }} />
          <Typography fontWeight="600" color="#1E40AF">Tips Tambahan</Typography>
        </Box>
        <Typography variant="body2" color="#1E40AF">{error.tips}</Typography>
      </Box>
    </Paper>
  );
}
