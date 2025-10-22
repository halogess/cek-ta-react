import React from 'react';
import { Paper, Typography, Box, Stack, IconButton, Chip, Tooltip } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { CheckCircleOutline, ErrorOutline, HourglassEmptyOutlined, CancelOutlined, DownloadOutlined } from '@mui/icons-material';

const HistoryItem = ({ filename, date, size, status, statusColor, errorCount, onCancel, isPassedValidation, onDetail, onDownload }) => (
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
        <Typography fontWeight="600" noWrap>{filename}</Typography>
        <Stack direction="row" spacing={1} divider={<Typography color="text.secondary">•</Typography>}>
          <Typography variant="body2" color="text.secondary">Diupload pada {date}</Typography>
          <Typography variant="body2" color="text.secondary">{size}</Typography>
        </Stack>
      </Box>
    </Stack>
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 'auto' }}>
      <Box textAlign="right" sx={{ width: 100 }}>
        {status === 'Selesai' && (
          <>
            <Typography fontWeight="600" variant="body2">{errorCount} Kesalahan</Typography>
            <Typography variant="caption" color="text.secondary">Ditemukan</Typography>
          </>
        )}
      </Box>
      <Tooltip title={status === 'Dalam Antrian' ? 'Dokumen sedang menunggu diproses' : status === 'Menunggu Konfirmasi' ? 'Dokumen memerlukan konfirmasi' : 'Validasi dokumen selesai'} arrow>
        <Chip 
          icon={status === 'Selesai' ? <CheckCircleOutline /> : status === 'Menunggu Konfirmasi' ? <ErrorOutline /> : <HourglassEmptyOutlined />}
          label={status} 
          color={statusColor} 
          size="small" 
          variant="outlined"
          sx={{ 
            width: 200,
            fontWeight: 500,
            bgcolor: statusColor === 'primary' ? '#DBEAFE' : statusColor === 'warning' ? '#FEF3C7' : '#D1FAE5',
            color: statusColor === 'primary' ? '#1E40AF' : statusColor === 'warning' ? '#92400E' : '#065F46',
            borderColor: statusColor === 'primary' ? '#3B82F6' : statusColor === 'warning' ? '#F59E0B' : '#10B981'
          }} 
        />
      </Tooltip>
      <Box sx={{ width: 40, display: 'flex', justifyContent: 'center' }}>
        {status === 'Dalam Antrian' && (
          <Tooltip title="Batalkan" arrow>
            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onCancel(); }}>
              <CancelOutlined />
            </IconButton>
          </Tooltip>
        )}
        {status === 'Selesai' && isPassedValidation && (
          <Tooltip title="Download Sertifikat" arrow>
            <IconButton size="small" color="primary" onClick={(e) => { e.stopPropagation(); onDownload(); }}>
              <DownloadOutlined />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  </Paper>
);

export default HistoryItem;