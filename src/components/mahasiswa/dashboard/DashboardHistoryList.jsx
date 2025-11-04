import { Paper, Box, Stack, Typography, IconButton, Tooltip } from '@mui/material';
import { DescriptionOutlined, DownloadOutlined, CancelOutlined, HourglassEmptyOutlined, CheckCircleOutline, WarningAmberOutlined, BlockOutlined } from '@mui/icons-material';

export default function DashboardHistoryList({ data, onDetail, onDownload, onCancel }) {
  return (
    <Stack spacing={1.5}>
      {data.map((item) => (
        <Paper
          key={item.id}
          elevation={0}
          onClick={() => onDetail(item.id)}
          sx={{
            p: 2,
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            bgcolor: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderColor: '#CBD5E1'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '8px',
                bgcolor: '#EEF2FF',
                color: '#3B82F6',
                flexShrink: 0
              }}
            >
              <DescriptionOutlined sx={{ fontSize: 20 }} />
            </Box>
            
            <Box sx={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography fontWeight="600" sx={{ fontSize: '0.875rem', lineHeight: 1.2 }} noWrap>
                {item.judulBuku || item.filename}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {item.status === 'Lolos' && <CheckCircleOutline sx={{ fontSize: 14, color: '#059669' }} />}
                {item.status === 'Tidak Lolos' && <WarningAmberOutlined sx={{ fontSize: 14, color: '#DC2626' }} />}
                {item.status === 'Dalam Antrian' && <HourglassEmptyOutlined sx={{ fontSize: 14, color: '#2563EB' }} />}
                {item.status === 'Diproses' && <HourglassEmptyOutlined sx={{ fontSize: 14, color: '#F59E0B' }} />}
                {item.status === 'Dibatalkan' && <BlockOutlined sx={{ fontSize: 14, color: '#6B7280' }} />}
                <Typography variant="caption" sx={{ 
                  color: item.status === 'Lolos' ? '#059669' : 
                         item.status === 'Tidak Lolos' ? '#DC2626' : 
                         item.status === 'Dalam Antrian' ? '#2563EB' : 
                         item.status === 'Diproses' ? '#F59E0B' : '#6B7280',
                  fontWeight: 500
                }}>
                  {item.status}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                Diupload pada {item.date}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              {item.status === 'Dalam Antrian' && (
                <Tooltip title="Batalkan" arrow>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onCancel(item.filename || item.judulBuku); 
                    }}
                  >
                    <CancelOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {item.status === 'Lolos' && item.isPassedValidation && (
                <Tooltip title="Download Sertifikat" arrow>
                  <IconButton 
                    size="small" 
                    color="primary" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onDownload(); 
                    }}
                  >
                    <DownloadOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Paper>
      ))}
    </Stack>
  );
}
