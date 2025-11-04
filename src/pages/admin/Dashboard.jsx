import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { useHeader } from '../../context/HeaderContext';
import StatsCards from '../../components/admin/dashboard/StatsCards';
import ErrorStatistics from '../../components/admin/dashboard/ErrorStatistics';
import Loading from '../../components/shared/ui/Loading';
import { dashboardService } from '../../services';

export default function AdminDashboard() {
  const { setHeaderInfo } = useHeader();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [errorStats, setErrorStats] = useState(null);

  useEffect(() => {
    setHeaderInfo({ title: 'Dashboard' });
    fetchDashboardData();
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsData = await dashboardService.getAdminStats();
      const errorStatsData = await dashboardService.getErrorStatistics();
      setStats(statsData);
      setErrorStats(errorStatsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
