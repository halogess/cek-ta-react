import { Box, Button } from '@mui/material';
import { CheckCircleOutline, DescriptionOutlined, TaskAltOutlined, ErrorOutlineOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../shared/ui/StatCard';
import { activeTemplate, getStatistics } from '../../../data/mockData';

export default function StatsCards() {
  const navigate = useNavigate();
  const stats = getStatistics();

  return (
    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '200px' }}>
        <StatCard 
          title="Versi Panduan Aktif" 
          value={activeTemplate.name} 
          icon={<DescriptionOutlined />} 
          iconColor="info.main"
          action={
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => navigate('/admin/template')}
              sx={{ mt: 1, fontSize: '0.75rem' }}
            >
              Lihat Detail
            </Button>
          }
        />
      </Box>
      <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '200px' }}>
        <StatCard 
          title="Total Validasi" 
          value={stats.total.toString()} 
          icon={<CheckCircleOutline />} 
          iconColor="primary.main" 
        />
      </Box>
      <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '200px' }}>
        <StatCard 
          title="Lolos Validasi" 
          value={stats.passed.toString()} 
          icon={<TaskAltOutlined />} 
          iconColor="success.main" 
        />
      </Box>
      <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '200px' }}>
        <StatCard 
          title="Perlu Perbaikan" 
          value={stats.needsFix.toString()} 
          icon={<ErrorOutlineOutlined />} 
          iconColor="error.main" 
        />
      </Box>
    </Box>
  );
}
