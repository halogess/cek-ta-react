import { useState } from 'react';
import { Paper, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Chip, Stack } from '@mui/material';
import { ExpandMore, DescriptionOutlined } from '@mui/icons-material';

export default function DocumentStructure({ documentStructure }) {
  const [expanded, setExpanded] = useState('panel0');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const colors = {
    Paragraf: { bg: '#DBEAFE', text: '#1E40AF' },
    Caption: { bg: '#FCE7F3', text: '#9F1239' },
    Footnote: { bg: '#FEF3C7', text: '#92400E' },
    Formula: { bg: '#E9D5FF', text: '#6B21A8' },
    'List-item': { bg: '#D1FAE5', text: '#065F46' },
    Gambar: { bg: '#FED7AA', text: '#9A3412' },
    Judul: { bg: '#E0E7FF', text: '#3730A3' },
    Tabel: { bg: '#CCFBF1', text: '#115E59' },
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <DescriptionOutlined color="primary" />
        <Typography variant="h6" fontWeight="bold">Struktur Dokumen</Typography>
      </Box>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Organisasi bab dan subbab dalam dokumen</Typography>

      {documentStructure.map((chapter, index) => (
        <Accordion 
          key={index}
          expanded={expanded === `panel${index}`}
          onChange={handleChange(`panel${index}`)}
          sx={{ mb: 1, '&:before': { display: 'none' }, boxShadow: 'none', border: '1px solid #E2E8F0', borderRadius: '8px !important' }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight="600">{chapter.chapter}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: '#F9FAFB' }}>
            <Stack spacing={2}>
              {chapter.pengantarStats && (
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <Typography fontWeight="600" gutterBottom>Pengantar Bab</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {Object.entries(chapter.pengantarStats).map(([key, value]) => {
                      const color = colors[key] || { bg: '#F3F4F6', text: '#374151' };
                      return (
                        <Chip key={key} label={`${key}: ${value}`} size="small" sx={{ bgcolor: color.bg, color: color.text, fontWeight: 500, border: 'none' }} />
                      );
                    })}
                  </Box>
                </Box>
              )}
              {chapter.sections.map((section, sIdx) => (
                <Box key={sIdx} sx={{ p: 2, bgcolor: 'white', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <Typography fontWeight="600" gutterBottom>{section.title}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {Object.entries(section.stats).map(([key, value]) => {
                      const color = colors[key] || { bg: '#F3F4F6', text: '#374151' };
                      return (
                        <Chip key={key} label={`${key}: ${value}`} size="small" sx={{ bgcolor: color.bg, color: color.text, fontWeight: 500, border: 'none' }} />
                      );
                    })}
                  </Box>
                </Box>
              ))}
              {chapter.penutupStats && (
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <Typography fontWeight="600" gutterBottom>Penutup Bab</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {Object.entries(chapter.penutupStats).map(([key, value]) => {
                      const color = colors[key] || { bg: '#F3F4F6', text: '#374151' };
                      return (
                        <Chip key={key} label={`${key}: ${value}`} size="small" sx={{ bgcolor: color.bg, color: color.text, fontWeight: 500, border: 'none' }} />
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
}
