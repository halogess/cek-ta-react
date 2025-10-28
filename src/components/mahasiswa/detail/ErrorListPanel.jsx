import { Paper, Typography, Box, Chip, Accordion, AccordionSummary, AccordionDetails, Stack } from '@mui/material';
import { ErrorOutline, ExpandMore, LightbulbOutlined } from '@mui/icons-material';
import { useEffect, useRef } from 'react';

export default function ErrorListPanel({ errors, selectedError, onSelectError, showRecommendations = true }) {
  const selectedRef = useRef(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedError]);

  if (!showRecommendations) {
    return (
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%' }}>
        <Typography variant="subtitle1" fontWeight="600" gutterBottom>Daftar Kesalahan</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>Kesalahan format yang ditemukan</Typography>
        <Box sx={{ maxHeight: '500px', overflowY: 'auto', pr: 1 }}>
          <Stack spacing={1}>
            {errors.map((error, index) => (
              <Box
                key={index}
                ref={selectedError === index ? selectedRef : null}
                onClick={() => onSelectError(index)}
                sx={{
                  p: 2,
                  border: selectedError === index ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                  borderRadius: '12px',
                  bgcolor: selectedError === index ? '#F0F9FF' : 'white',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#F8FAFC' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Chip 
                    label={error.category} 
                    size="small" 
                    sx={{ fontWeight: 500, height: 20, fontSize: '0.7rem', bgcolor: '#E0E7FF', color: '#3730A3' }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {error.location}
                  </Typography>
                </Box>
                <Typography fontWeight="600" variant="body2" sx={{ lineHeight: 1.4 }}>{error.title}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%' }}>
      <Typography variant="subtitle1" fontWeight="600" gutterBottom>Daftar Kesalahan</Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>Kesalahan format yang ditemukan</Typography>
      <Box sx={{ maxHeight: '500px', overflowY: 'auto', pr: 1 }}>
        {errors.map((error, index) => (
          <Accordion
            key={index}
            ref={selectedError === index ? selectedRef : null}
            expanded={selectedError === index}
            onChange={() => onSelectError(selectedError === index ? -1 : index)}
            sx={{
              mb: 1,
              '&:before': { display: 'none' },
              boxShadow: 'none',
              border: selectedError === index ? '2px solid #3B82F6' : '1px solid #E2E8F0',
              borderRadius: '12px !important',
              bgcolor: selectedError === index ? '#ffffff' : 'white'
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ minHeight: 'auto', '& .MuiAccordionSummary-content': { my: 1.5 } }}>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Chip 
                    label={error.category} 
                    size="small" 
                    sx={{ fontWeight: 500, height: 20, fontSize: '0.7rem', bgcolor: '#E0E7FF', color: '#3730A3' }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {error.location}
                  </Typography>
                </Box>
                <Typography fontWeight="600" variant="body2" sx={{ lineHeight: 1.4 }}>{error.title}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 1 }}>
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <LightbulbOutlined sx={{ fontSize: 16, color: '#3B82F6' }} />
                    Rekomendasi Perbaikan
                  </Typography>
                  <Stack spacing={1}>
                    {error.steps.map((step, idx) => (
                      <Box key={idx} sx={{ display: 'flex', gap: 1 }}>
                        <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: '#3B82F6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 'bold', flexShrink: 0 }}>
                          {idx + 1}
                        </Box>
                        <Typography variant="caption" sx={{ lineHeight: 1.5 }}>{step}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Box sx={{ p: 1, bgcolor: '#EFF6FF', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                  <Typography variant="caption" fontWeight="600" color="#1E40AF" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <LightbulbOutlined sx={{ fontSize: 14 }} /> Tips
                  </Typography>
                  <Typography variant="caption" color="#1E40AF" sx={{ lineHeight: 1.5 }}>{error.tips}</Typography>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Paper>
  );
}
