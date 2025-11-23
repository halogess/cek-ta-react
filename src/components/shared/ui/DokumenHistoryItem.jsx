import { Paper, Typography, Box, Stack, IconButton, Tooltip } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { CancelOutlined } from '@mui/icons-material';
import StatusChip from './StatusChip';

const DokumenHistoryItem = ({ id, filename, date, size, status, errorCount, onCancel, onDetail, showCancelButton = true }) => (
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
    <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', width: 40 }}>
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
        <Typography fontWeight="600">{filename}</Typography>
        <Stack direction="row" spacing={1} divider={<Typography color="text.secondary">•</Typography>}>
          <Typography variant="body2" color="text.secondary">Diupload pada {date}</Typography>
          <Typography variant="body2" color="text.secondary">{size}</Typography>
        </Stack>
      </Box>
    </Stack>
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 2 }}>
      <Box textAlign="right" sx={{ display: { xs: 'none', sm: 'block' }, width: 100 }}>
        {(status === 'Lolos' || status === 'Tidak Lolos') && errorCount !== null && (
          <>
            <Typography fontWeight="600" variant="body2">{errorCount} Kesalahan</Typography>
            <Typography variant="caption" color="text.secondary">Ditemukan</Typography>
          </>
        )}
      </Box>
      <StatusChip status={status} />
      <Box sx={{ width: 40, display: 'flex', justifyContent: 'center' }}>
        {status === 'Dalam Antrian' && showCancelButton && (
          <Tooltip title="Batalkan" arrow>
            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onCancel(); }}>
              <CancelOutlined />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  </Paper>
);

export default DokumenHistoryItem;
