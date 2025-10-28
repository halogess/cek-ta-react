import { Paper, Typography, Box, Stack, Chip } from '@mui/material';
import { useEffect, useRef } from 'react';
import ErrorAccordionItem from './ErrorAccordionItem';

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
          <ErrorAccordionItem
            key={index}
            error={error}
            index={index}
            isExpanded={selectedError === index}
            onToggle={() => onSelectError(selectedError === index ? -1 : index)}
            selectedRef={selectedError === index ? selectedRef : null}
          />
        ))}
      </Box>
    </Paper>
  );
}
