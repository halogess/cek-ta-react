import { Paper, Typography, Box } from '@mui/material';
import { WarningAmber } from '@mui/icons-material';

export default function SummaryCard({ errorCount, score }) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '2px solid #FEF3C7', bgcolor: '#FFFBEB' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ bgcolor: '#FEF3C7', p: 2, borderRadius: '12px' }}>
            <WarningAmber sx={{ fontSize: 32, color: '#F59E0B' }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="bold">{errorCount} Kesalahan Ditemukan</Typography>
            <Typography color="text.secondary">Dokumen memerlukan perbaikan sebelum dapat disetujui</Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h3" fontWeight="bold" color="#F59E0B">{score}%</Typography>
          <Typography color="text.secondary">Skor Validasi</Typography>
        </Box>
      </Box>
    </Paper>
  );
}
