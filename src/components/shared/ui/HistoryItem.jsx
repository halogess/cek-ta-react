import { Paper, Typography, Box, Stack, IconButton, Tooltip } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { CancelOutlined, DownloadOutlined } from '@mui/icons-material';
import StatusChip from './StatusChip';

const HistoryItem = ({ id, filename, date, size, status, statusColor, errorCount, onCancel, isPassedValidation, onDetail, onDownload, showCancelButton = true, additionalInfo, isAdminView = false, judulTA, nama, nrp, jurusan, skor, judulBuku, totalFiles, type, numChapters }) => (
  <Paper
    elevation={0}
    onClick={onDetail}
    sx={{
      p: 2.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
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
    <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
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
      <Box sx={{ minWidth: 0, flex: 1 }}>
        {isAdminView ? (
          <>
            <Typography fontWeight="600" noWrap sx={{ mb: 0.5 }}>{type === 'book' ? judulBuku : judulTA}</Typography>
            <Stack direction="row" spacing={1.5} divider={<Box sx={{ width: '1px', alignSelf: 'stretch', bgcolor: '#CBD5E1' }} />}>
              <Typography variant="body2" color="text.secondary" sx={{ flex: '0 0 10%' }}>{type === 'book' ? `ID: ${id}` : filename}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ flex: '0 0 20%' }}>{date}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ flex: '0 0 25%' }}>{nama}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ flex: '0 0 10%' }}>{nrp}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ flex: '1 1 auto' }}>{jurusan}</Typography>
            </Stack>
          </>
        ) : (
          <>
            <Typography fontWeight="600" noWrap>
              {type === 'book' ? filename : filename}
            </Typography>
            {type === 'book' ? (
              <Typography variant="body2" color="text.secondary">{numChapters} bab</Typography>
            ) : (
              <Stack direction="row" spacing={1} divider={<Typography color="text.secondary">•</Typography>}>
                <Typography variant="body2" color="text.secondary">Diupload pada {date}</Typography>
                <Typography variant="body2" color="text.secondary">{size}</Typography>
              </Stack>
            )}
          </>
        )}
      </Box>
    </Stack>
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 'auto' }}>
      <Box textAlign="right" sx={{ width: 100 }}>
        {isAdminView ? (
          <>
            {(status === 'Lolos' || status === 'Tidak Lolos') && skor !== null && <Typography fontWeight="600" variant="body2">Skor: {skor}</Typography>}
            {(status === 'Lolos' || status === 'Tidak Lolos') && errorCount !== null && <Typography variant="caption" color="text.secondary">{errorCount} Kesalahan</Typography>}
          </>
        ) : (status === 'Lolos' || status === 'Tidak Lolos') && errorCount !== null && (
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

export default HistoryItem;