import { Paper, Box, Typography, Button } from '@mui/material';
import { DescriptionOutlined, NavigateBefore, NavigateNext } from '@mui/icons-material';

export default function DocumentPreview({ selectedError, totalErrors, onPrevious, onNext }) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight="600">Pratinjau Dokumen</Typography>
          <Typography variant="caption" color="text.secondary">Area bermasalah ditandai highlight merah</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button 
            variant="outlined" 
            size="small"
            disabled={selectedError === -1 || selectedError === 0}
            onClick={onPrevious}
            startIcon={<NavigateBefore />}
            sx={{ minWidth: '70px', fontSize: '0.75rem' }}
          >
            Previous
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            disabled={selectedError === -1 || selectedError === totalErrors - 1}
            onClick={onNext}
            endIcon={<NavigateNext />}
            sx={{ minWidth: '70px', fontSize: '0.75rem' }}
          >
            Next
          </Button>
        </Box>
      </Box>
      <Box sx={{ 
        minHeight: '450px', 
        bgcolor: '#F8FAFC', 
        borderRadius: '12px', 
        border: '2px dashed #CBD5E1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 1.5
      }}>
        <DescriptionOutlined sx={{ fontSize: 48, color: '#94A3B8' }} />
        <Typography variant="body2" color="text.secondary">
          {selectedError === -1 ? 'Pilih kesalahan untuk melihat pratinjau' : 'Pratinjau dokumen akan ditampilkan di sini'}
        </Typography>
      </Box>
    </Paper>
  );
}
