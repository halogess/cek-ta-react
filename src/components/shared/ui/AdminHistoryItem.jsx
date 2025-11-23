import { Paper, Typography, Box, Stack, IconButton, Tooltip } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { CancelOutlined } from '@mui/icons-material';
import StatusChip from './StatusChip';

const AdminHistoryItem = ({ id, filename, date, status, errorCount, onDetail, judulTA, nama, nrp, jurusan, skor, judulBuku, type }) => (
  <Paper
    elevation={0}
    onClick={onDetail}
    sx={{
      p: 2.5,
      display: 'flex',
      alignItems: 'center',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      cursor: 'pointer',
      transition: 'all 0.2s',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderColor: '#CBD5E1'
      }
    }}
  >
    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', width: 40, mr: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: '8px',
          bgcolor: '#EEF2FF',
          color: '#3B82F6'
        }}
      >
        <DescriptionOutlinedIcon />
      </Box>
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography fontWeight="600" sx={{ mb: 0.5 }}>{type === 'book' ? judulBuku : judulTA}</Typography>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ flex: '0 0 10%', minWidth: 0 }}>{type === 'book' ? `ID: ${id}` : filename}</Typography>
        <Box sx={{ width: '1px', height: '12px', bgcolor: '#CBD5E1' }} />
        <Typography variant="body2" color="text.secondary" sx={{ flex: '0 0 18%', minWidth: 0, display: { xs: 'none', sm: 'block' } }}>{date}</Typography>
        <Box sx={{ width: '1px', height: '12px', bgcolor: '#CBD5E1', display: { xs: 'none', sm: 'block' } }} />
        <Typography variant="body2" color="text.secondary" sx={{ flex: '0 0 25%', minWidth: 0 }}>{nama}</Typography>
        <Box sx={{ width: '1px', height: '12px', bgcolor: '#CBD5E1' }} />
        <Typography variant="body2" color="text.secondary" sx={{ flex: '0 0 15%', minWidth: 0 }}>{nrp}</Typography>
        <Box sx={{ width: '1px', height: '12px', bgcolor: '#CBD5E1', display: { xs: 'none', md: 'block' } }} />
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1, minWidth: 0, display: { xs: 'none', md: 'block' } }}>{jurusan}</Typography>
      </Box>
    </Box>
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 2 }}>
      <Box textAlign="right" sx={{ display: { xs: 'none', sm: 'block' }, width: 100 }}>
        {(status === 'Lolos' || status === 'Tidak Lolos') && skor !== null && <Typography fontWeight="600" variant="body2">Skor: {skor}</Typography>}
        {(status === 'Lolos' || status === 'Tidak Lolos') && errorCount !== null && <Typography variant="caption" color="text.secondary">{errorCount} Kesalahan</Typography>}
      </Box>
      <StatusChip status={status} />
    </Box>
  </Paper>
);

export default AdminHistoryItem;
