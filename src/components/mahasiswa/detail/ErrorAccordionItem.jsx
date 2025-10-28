import { Accordion, AccordionSummary, AccordionDetails, Box, Typography, Chip, Stack } from '@mui/material';
import { ExpandMore, LightbulbOutlined } from '@mui/icons-material';

export default function ErrorAccordionItem({ error, index, isExpanded, onToggle, selectedRef }) {
  return (
    <Accordion
      ref={selectedRef}
      expanded={isExpanded}
      onChange={onToggle}
      sx={{
        mb: 1,
        '&:before': { display: 'none' },
        boxShadow: 'none',
        border: isExpanded ? '2px solid #3B82F6' : '1px solid #E2E8F0',
        borderRadius: '12px !important',
        bgcolor: isExpanded ? '#ffffff' : 'white'
      }}
    >
      <AccordionSummary expandIcon={<ExpandMore />} sx={{ minHeight: 'auto', '& .MuiAccordionSummary-content': { my: 1.5 } }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Chip label={error.category} size="small" sx={{ fontWeight: 500, height: 20, fontSize: '0.7rem', bgcolor: '#E0E7FF', color: '#3730A3' }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{error.location}</Typography>
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
  );
}
