import { Paper, Typography, Box, Stack, IconButton, Tooltip, List, ListItem, ListItemText, Button } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { CancelOutlined, DownloadOutlined } from '@mui/icons-material';
import StatusChip from './StatusChip';
import { useState } from 'react';

const HistoryItem = ({ id, filename, date, size, status, statusColor, errorCount, onCancel, isPassedValidation, onDetail, onDownload, showCancelButton = true, additionalInfo, isAdminView = false, judulTA, nama, nrp, jurusan, skor, judulBuku, totalFiles, type, numChapters, bab }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedBab = showAll ? bab : bab?.slice(0, 4) || [];
  
  return (
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
    <Box sx={{ flex: { xs: 1, lg: '0 0 35%' }, minWidth: 0 }}>
      {isAdminView ? (
        <>
          <Typography fontWeight="600" sx={{ mb: 0.5 }}>{type === 'book' ? judulBuku : judulTA}</Typography>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" alignItems="center" divider={<Box sx={{ width: '1px', height: '12px', bgcolor: '#CBD5E1' }} />}>
            <Typography variant="body2" color="text.secondary">{type === 'book' ? `ID: ${id}` : filename}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>{date}</Typography>
            <Typography variant="body2" color="text.secondary">{nama}</Typography>
            <Typography variant="body2" color="text.secondary">{nrp}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>{jurusan}</Typography>
          </Stack>
        </>
      ) : (
        <Typography fontWeight="600">
          {type === 'book' ? filename : filename}
        </Typography>
      )}
    </Box>
    {type === 'book' && bab && bab.length > 0 && !isAdminView ? (
      <Box sx={{ flex: { xs: 1, lg: '0 0 40%' }, mx: 2, minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
          {bab.length - 2} bab ({bab.length} file)
        </Typography>
        <List dense disablePadding sx={{ '& .MuiListItem-root': { minHeight: 'auto' } }}>
          {displayedBab.map((fileName, index) => (
            <ListItem key={index} disablePadding sx={{ py: 0, minHeight: 'auto' }}>
              <ListItemText 
                primary={fileName}
                primaryTypographyProps={{ variant: 'body2', fontSize: '0.7rem', lineHeight: 1.2 }}
                sx={{ my: 0 }}
              />
            </ListItem>
          ))}
        </List>
        {bab.length > 4 && (
          <Button 
            size="small" 
            onClick={(e) => { e.stopPropagation(); setShowAll(!showAll); }}
            sx={{ mt: 0.5, p: 0, minWidth: 'auto', fontSize: '0.7rem', textTransform: 'none' }}
          >
            {showAll ? 'Tampilkan lebih sedikit' : `Tampilkan ${bab.length - 4} file lainnya`}
          </Button>
        )}
      </Box>
    ) : !type && !isAdminView ? (
      <Box sx={{ flex: { xs: 1, lg: '0 0 40%' }, mx: 2, minWidth: 0 }}>
        <Stack direction="row" spacing={1} divider={<Typography color="text.secondary">•</Typography>}>
          <Typography variant="body2" color="text.secondary">Diupload pada {date}</Typography>
          <Typography variant="body2" color="text.secondary">{size}</Typography>
        </Stack>
      </Box>
    ) : (
      <Box sx={{ flex: { xs: 0, lg: '0 0 40%' } }} />
    )}
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flex: '0 0 25%', justifyContent: 'flex-end' }}>
      <Box textAlign="right" sx={{ display: { xs: 'none', sm: 'block' }, width: 100 }}>
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
};

export default HistoryItem;