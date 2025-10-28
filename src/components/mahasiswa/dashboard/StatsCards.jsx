import { Box, Grid } from '@mui/material';
import { FileCopyOutlined, CheckCircleOutline, WarningAmberOutlined, HourglassEmptyOutlined, BlockOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../shared/ui/StatCard';

export default function StatsCards({ stats }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 2 }}>
      <StatCard 
        title="Total Dokumen" 
        value={stats.total.toString()} 
        subtitle="Semua dokumen yang diunggah" 
        icon={<FileCopyOutlined />} 
        iconColor="#64748B"
        onClick={() => navigate('/mahasiswa/history')}
      />
      <StatCard 
        title="Menunggu" 
        value={stats.waiting.toString()} 
        subtitle="Sedang diproses sistem" 
        icon={<HourglassEmptyOutlined />} 
        iconColor="#3B82F6"
        onClick={() => navigate('/mahasiswa/history?status=Menunggu')}
      />
      <StatCard 
        title="Lolos" 
        value={stats.passed.toString()} 
        subtitle="Memenuhi standar format" 
        icon={<CheckCircleOutline />} 
        iconColor="#10B981"
        onClick={() => navigate('/mahasiswa/history?status=Lolos')}
      />
      <StatCard 
        title="Tidak Lolos" 
        value={stats.needsFix.toString()} 
        subtitle="Perlu diperbaiki" 
        icon={<WarningAmberOutlined />} 
        iconColor="#EF4444"
        onClick={() => navigate('/mahasiswa/history?status=Tidak Lolos')}
      />
      <StatCard 
        title="Dibatalkan" 
        value={stats.cancelled.toString()} 
        subtitle="Validasi dibatalkan" 
        icon={<BlockOutlined />} 
        iconColor="#9CA3AF"
        onClick={() => navigate('/mahasiswa/history?status=Dibatalkan')}
      />
    </Box>
  );
}
