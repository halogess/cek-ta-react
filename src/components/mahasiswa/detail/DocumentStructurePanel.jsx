import { Paper, Box, Typography, Accordion, AccordionSummary, AccordionDetails, Stack, Chip } from '@mui/material';
import { DescriptionOutlined, ExpandMore } from '@mui/icons-material';

export default function DocumentStructurePanel({ documentStructure, expanded, onExpand }) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <DescriptionOutlined color="primary" sx={{ fontSize: 20 }} />
        <Typography variant="subtitle1" fontWeight="600">Struktur Dokumen</Typography>
      </Box>

      {documentStructure.map((chapter, index) => (
        <Accordion 
          key={index}
          expanded={expanded === `panel${index}`}
          onChange={onExpand(`panel${index}`)}
          sx={{ mb: 1, '&:before': { display: 'none' }, boxShadow: 'none', border: '1px solid #E2E8F0', borderRadius: '12px !important' }}
        >
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ minHeight: 'auto', '& .MuiAccordionSummary-content': { my: 1 } }}>
            <Typography variant="body2" fontWeight="600">{chapter.chapter}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: '#F9FAFB' }}>
            <Stack spacing={2}>
              {chapter.pengantarStats && (
                <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <Typography variant="caption" fontWeight="600" gutterBottom sx={{ display: 'block' }}>Pengantar Bab</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {Object.entries(chapter.pengantarStats).map(([key, value]) => (
                      <Chip key={key} label={`${key}: ${value}`} size="small" sx={{ bgcolor: '#DBEAFE', color: '#1E40AF', fontWeight: 500, border: 'none' }} />
                    ))}
                  </Box>
                </Box>
              )}
              {chapter.sections.map((section, sIdx) => (
                <Box key={sIdx} sx={{ p: 1.5, bgcolor: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <Typography variant="caption" fontWeight="600" gutterBottom sx={{ display: 'block' }}>{section.title}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {Object.entries(section.stats).map(([key, value]) => (
                      <Chip key={key} label={`${key}: ${value}`} size="small" sx={{ bgcolor: '#DBEAFE', color: '#1E40AF', fontWeight: 500, border: 'none' }} />
                    ))}
                  </Box>
                </Box>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
}
