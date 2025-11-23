import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { useHeader } from '../../context/HeaderContext';
import StatsCards from '../../components/admin/dashboard/StatsCards';
import ErrorStatistics from '../../components/admin/dashboard/ErrorStatistics';
import Loading from '../../components/shared/ui/Loading';
import { bukuService } from '../../services';
import { transformStats } from '../../utils/dataTransformers';

export default function AdminDashboard() {
  const { setHeaderInfo } = useHeader();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, waiting: 0, passed: 0, needsFix: 0, usersByProdi: {} });
  const [errorStats, setErrorStats] = useState(null);

  useEffect(() => {
    setHeaderInfo({ title: 'Dashboard' });
    fetchDashboardData();
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsData = await bukuService.getBukuStatsAdmin();
      
      const usersByProdi = {};
      if (statsData.per_jurusan) {
        statsData.per_jurusan.forEach(item => {
          usersByProdi[item.kode] = { count: item.total_mhs, label: item.singkatan };
        });
      }
      
      const mappedStats = {
        ...transformStats(statsData),
        usersByProdi
      };
      setStats(mappedStats);
      setErrorStats([]);
    } catch (error) {
      setStats({ total: 0, waiting: 0, passed: 0, needsFix: 0, usersByProdi: {} });
      setErrorStats([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Memuat dashboard..." />;

  return (
    <Stack spacing={3}>
      <StatsCards stats={stats} />
      <ErrorStatistics errorStats={errorStats} usersByProdi={stats?.usersByProdi} />
    </Stack>
  )
}
