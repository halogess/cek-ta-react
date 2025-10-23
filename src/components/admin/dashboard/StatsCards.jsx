import { Box } from '@mui/material';
import { CheckCircleOutline, PeopleOutline, TaskAltOutlined, ErrorOutlineOutlined } from '@mui/icons-material';
import StatCard from '../../shared/ui/StatCard';

export default function StatsCards() {
  return (
    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '200px' }}>
        <StatCard 
          title="Total Validasi" 
          value="1,247" 
          icon={<CheckCircleOutline />} 
          iconColor="primary.main" 
        />
      </Box>
      <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '200px' }}>
        <StatCard 
          title="Mahasiswa Aktif" 
          value="342" 
          icon={<PeopleOutline />} 
          iconColor="success.main" 
        />
      </Box>
      <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '200px' }}>
        <StatCard 
          title="Lolos Validasi" 
          value="892" 
          icon={<TaskAltOutlined />} 
          iconColor="secondary.main" 
        />
      </Box>
      <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '200px' }}>
        <StatCard 
          title="Perlu Perbaikan" 
          value="355" 
          icon={<ErrorOutlineOutlined />} 
          iconColor="error.main" 
        />
      </Box>
    </Box>
  );
}
