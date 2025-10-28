import React from 'react';
import { Paper, Typography, Box, Stack, IconButton, Chip, Tooltip } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { CheckCircleOutline, ErrorOutline, HourglassEmptyOutlined, CancelOutlined, DownloadOutlined, CheckOutlined, BlockOutlined } from '@mui/icons-material';

const HistoryItem = ({ filename, date, size, status, statusColor, errorCount, onCancel, isPassedValidation, onDetail, onDownload, showCancelButton = true, additionalInfo, isAdminView = false, judulTA, nama, nrp, jurusan, skor }) => (
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
            <Typography fontWeight="600" noWrap>{judulTA}</Typography>
            <Stack direction="row" spacing={1} divider={<Typography color="text.secondary">•</Typography>}>
              <Typography variant="body2" color="text.secondary">{filename}</Typography>
              <Typography variant="body2" color="text.secondary">{date}</Typography>
              <Typography variant="body2" color="text.secondary">{nama}</Typography>
              <Typography variant="body2" color="text.secondary">{nrp}</Typography>
              <Typography variant="body2" color="text.secondary">{jurusan}</Typography>
            </Stack>
          </>
        ) : (
          <>
            <Typography fontWeight="600" noWrap>{filename}</Typography>
            <Stack direction="row" spacing={1} divider={<Typography color="text.secondary">•</Typography>}>
              <Typography variant="body2" color="text.secondary">Diupload pada {date}</Typography>
              <Typography variant="body2" color="text.secondary">{size}</Typography>
              {additionalInfo && <Typography variant="body2" color="text.secondary">{additionalInfo}</Typography>}
            </Stack>
          </>
        )}
      </Box>
    </Stack>
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 'auto' }}>
      <Box textAlign="right" sx={{ width: 100 }}>
        {isAdminView ? (
          <>
            {skor !== null && <Typography fontWeight="600" variant="body2">Skor: {skor}</Typography>}
            {errorCount !== null && <Typography variant="caption" color="text.secondary">{errorCount} Kesalahan</Typography>}
          </>
        ) : (status === 'Lolos' || status === 'Tidak Lolos') && errorCount !== null && (
          <>
            <Typography fontWeight="600" variant="body2">{errorCount} Kesalahan</Typography>
            <Typography variant="caption" color="text.secondary">Ditemukan</Typography>
          </>
        )}
      </Box>
      <Tooltip 
        title={
          status === 'Dalam Antrian' ? 'Dokumen sedang menunggu diproses' : 
          status === 'Diproses' ? 'Sistem sedang memvalidasi dokumen' : 
          status === 'Dibatalkan' ? 'Validasi dokumen telah dibatalkan' : 
          status === 'Lolos' ? 'Dokumen lulus validasi' :
          status === 'Tidak Lolos' ? 'Dokumen tidak lulus validasi' : 'Validasi dokumen selesai'
        } 
        arrow
        componentsProps={{
          tooltip: {
            sx: {
              maxWidth: 250,
              textAlign: 'center'
            }
          }
        }}
      >
        <Chip 
          icon={
            status === 'Lolos' ? <CheckCircleOutline /> : 
            status === 'Tidak Lolos' ? <ErrorOutline /> :
            status === 'Diproses' ? <HourglassEmptyOutlined /> :
            status === 'Dibatalkan' ? <BlockOutlined /> : 
            <HourglassEmptyOutlined />
          }
          label={status} 
          color={statusColor} 
          size="small" 
          variant="outlined"
          sx={{ 
            width: 200,
            fontWeight: 500,
            bgcolor: 
              statusColor === 'info' ? '#DBEAFE' : 
              statusColor === 'warning' ? '#FEF3C7' : 
              statusColor === 'error' ? '#FEE2E2' : 
              statusColor === 'success' ? '#D1FAE5' : '#F3F4F6',
            color: 
              statusColor === 'info' ? '#1E40AF' : 
              statusColor === 'warning' ? '#92400E' : 
              statusColor === 'error' ? '#991B1B' : 
              statusColor === 'success' ? '#065F46' : '#6B7280',
            borderColor: 
              statusColor === 'info' ? '#3B82F6' : 
              statusColor === 'warning' ? '#F59E0B' : 
              statusColor === 'error' ? '#EF4444' : 
              statusColor === 'success' ? '#10B981' : '#D1D5DB'
          }} 
        />
      </Tooltip>
      <Box sx={{ width: 40, display: 'flex', justifyContent: 'center' }}>
        {status === 'Dalam Antrian' && showCancelButton && (
          <Tooltip title="Batalkan" arrow>
            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onCancel(); }}>
              <CancelOutlined />
            </IconButton>
          </Tooltip>
        )}
        {status === 'Lolos' && isPassedValidation && (
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