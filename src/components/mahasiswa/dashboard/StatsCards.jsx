import { Box } from '@mui/material';
import { FileCopyOutlined, CheckCircleOutline, WarningAmberOutlined } from '@mui/icons-material';
import StatCard from '../../shared/ui/StatCard';

export default function StatsCards({ totalValidations, successCount, needsFixCount }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '250px' }}>
        <StatCard 
          title="Total Validasi" 
          value={totalValidations} 
          subtitle="Dokumen divalidasi" 
          icon={<FileCopyOutlined />} 
          iconColor="text.secondary" 
        />
      </Box>
      <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '250px' }}>
        <StatCard 
          title="Validasi Berhasil" 
          value={successCount} 
          subtitle="Lolos validasi" 
          icon={<CheckCircleOutline />} 
          iconColor="success.main" 
        />
      </Box>
      <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '250px' }}>
        <StatCard 
          title="Perlu Perbaikan" 
          value={needsFixCount} 
          subtitle="Dokumen dengan kesalahan" 
          icon={<WarningAmberOutlined />} 
          iconColor="warning.main" 
        />
      </Box>
    </Box>
  );
}
