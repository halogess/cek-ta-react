import { Paper, Typography, Box, Stack } from '@mui/material';
import { LightbulbOutlined, ErrorOutline } from '@mui/icons-material';

export default function RecommendationPanel({ error }) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <LightbulbOutlined color="primary" sx={{ fontSize: 20 }} />
        <Typography variant="subtitle1" fontWeight="600">Rekomendasi Perbaikan</Typography>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>Langkah-langkah untuk memperbaiki</Typography>

      <Box sx={{ p: 1.5, bgcolor: '#F9FAFB', borderRadius: '8px', mb: 2 }}>
        <Typography variant="caption" fontWeight="600" gutterBottom sx={{ display: 'block' }}>Kesalahan Terpilih:</Typography>
        <Typography variant="body2" color="text.secondary">{error.title}</Typography>
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
            <Typography variant="body2">{step}</Typography>
          </Box>
        ))}
      </Stack>

      <Box sx={{ mt: 2, p: 1.5, bgcolor: '#EFF6FF', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <LightbulbOutlined sx={{ color: '#3B82F6', fontSize: 18 }} />
          <Typography variant="caption" fontWeight="600" color="#1E40AF">Tips Tambahan</Typography>
        </Box>
        <Typography variant="caption" color="#1E40AF" sx={{ display: 'block', lineHeight: 1.5 }}>{error.tips}</Typography>
      </Box>
    </Paper>
  );
}
