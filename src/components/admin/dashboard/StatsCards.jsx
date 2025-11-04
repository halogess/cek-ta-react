import { Box } from '@mui/material';
import { FileCopyOutlined, CheckCircleOutline, ErrorOutlineOutlined, HourglassEmptyOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../shared/ui/StatCard';

export default function StatsCards({ stats = { total: 0, waiting: 0, passed: 0, needsFix: 0 } }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
      <StatCard 
        title="Total Validasi" 
        value={stats.total.toString()} 
        subtitle="Dokumen yang divalidasi"
        icon={<FileCopyOutlined />} 
        iconColor="#9333EA"
        onClick={() => navigate('/admin/history')}
      />
      <StatCard 
        title="Menunggu" 
        value={stats.waiting.toString()} 
        subtitle="Sedang diproses sistem"
        icon={<HourglassEmptyOutlined />} 
        iconColor="#3B82F6"
        onClick={() => navigate('/admin/history?status=Menunggu')}
      />
      <StatCard 
        title="Lolos" 
        value={stats.passed.toString()} 
        subtitle="Memenuhi standar format"
        icon={<CheckCircleOutline />} 
        iconColor="#10B981"
        onClick={() => navigate('/admin/history?status=Lolos')}
      />
      <StatCard 
        title="Tidak Lolos" 
        value={stats.needsFix.toString()} 
        subtitle="Perlu diperbaiki"
        icon={<ErrorOutlineOutlined />} 
        iconColor="#EF4444"
        onClick={() => navigate('/admin/history?status=Tidak Lolos')}
      />
    </Box>
  );
}
