import { Chip, Tooltip } from '@mui/material';
import { CheckCircleOutline, ErrorOutline, HourglassEmptyOutlined, BlockOutlined } from '@mui/icons-material';

const statusConfig = {
  'Lolos': {
    icon: <CheckCircleOutline />,
    color: 'success',
    bgcolor: '#D1FAE5',
    textColor: '#065F46',
    borderColor: '#10B981',
    tooltip: 'Dokumen lulus validasi'
  },
  'Tidak Lolos': {
    icon: <ErrorOutline />,
    color: 'error',
    bgcolor: '#FEE2E2',
    textColor: '#991B1B',
    borderColor: '#EF4444',
    tooltip: 'Dokumen tidak lulus validasi'
  },
  'Diproses': {
    icon: <HourglassEmptyOutlined />,
    color: 'warning',
    bgcolor: '#FEF3C7',
    textColor: '#92400E',
    borderColor: '#F59E0B',
    tooltip: 'Sistem sedang memvalidasi dokumen'
  },
  'Dalam Antrian': {
    icon: <HourglassEmptyOutlined />,
    color: 'info',
    bgcolor: '#DBEAFE',
    textColor: '#1E40AF',
    borderColor: '#3B82F6',
    tooltip: 'Dokumen sedang menunggu diproses'
  },
  'Dibatalkan': {
    icon: <BlockOutlined />,
    color: 'default',
    bgcolor: '#F3F4F6',
    textColor: '#6B7280',
    borderColor: '#D1D5DB',
    tooltip: 'Validasi dokumen telah dibatalkan'
  }
};

export default function StatusChip({ status, size = 'medium' }) {
  const config = statusConfig[status] || statusConfig['Dalam Antrian'];
  
  if (size === 'small') {
    return (
      <Tooltip title={config.tooltip} arrow>
        <Chip 
          icon={config.icon}
          label={status} 
          size="small" 
          variant="outlined"
          sx={{ 
            height: 20,
            fontSize: '0.7rem',
            fontWeight: 500,
            bgcolor: config.bgcolor,
            color: config.textColor,
            borderColor: config.borderColor,
            '& .MuiChip-icon': {
              fontSize: 14,
              ml: 0.5
            },
            '& .MuiChip-label': {
              px: 0.5
            }
          }} 
        />
      </Tooltip>
    );
  }
  
  return (
    <Tooltip title={config.tooltip} arrow>
      <Chip 
        icon={config.icon}
        label={status} 
        color={config.color} 
        size="small" 
        variant="outlined"
        sx={{ 
          width: 200,
          fontWeight: 500,
          bgcolor: config.bgcolor,
          color: config.textColor,
          borderColor: config.borderColor
        }} 
      />
    </Tooltip>
  );
}
