import { Paper, Typography, Accordion, AccordionSummary, AccordionDetails, Box, Chip } from '@mui/material';
import { ExpandMore, ErrorOutline } from '@mui/icons-material';

export default function BookErrorPanel({ files = [], errors = [] }) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <ErrorOutline color="error" />
        <Typography variant="h6" fontWeight="bold">
          Error per File
        </Typography>
      </Box>

      {files.map((file, index) => {
        const fileErrors = errors.filter(e => e.fileIndex === index);
        
        return (
          <Accordion key={index} sx={{ mb: 1, '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Typography fontWeight="medium">{file.name}</Typography>
                <Chip 
                  label={`${fileErrors.length} error`} 
                  size="small" 
                  color={fileErrors.length > 0 ? 'error' : 'success'}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {fileErrors.length === 0 ? (
                <Typography color="text.secondary">Tidak ada error</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {fileErrors.map((error, idx) => (
                    <Box key={idx} sx={{ p: 2, backgroundColor: '#FEF2F2', borderRadius: '8px', borderLeft: '4px solid #EF4444' }}>
                      <Typography variant="body2" fontWeight="bold" color="error.main" gutterBottom>
                        {error.category} - {error.severity}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {error.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {error.location}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Paper>
  );
}
