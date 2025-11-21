import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { useHeader } from '../../context/HeaderContext';
import StatsCards from '../../components/admin/dashboard/StatsCards';
import ErrorStatistics from '../../components/admin/dashboard/ErrorStatistics';
import Loading from '../../components/shared/ui/Loading';
import { dashboardService, validationService } from '../../services';

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
      const statsData = await validationService.getBukuStatsAdmin();
      console.log('📊 Buku stats admin:', statsData);
      const errorStatsData = await dashboardService.getErrorStatistics();
      setStats({
        total: statsData?.total || 0,
        waiting: statsData?.menunggu_validasi || 0,
        passed: statsData?.lolos || 0,
        needsFix: statsData?.tidak_lolos || 0,
        usersByProdi: {}
      });
      setErrorStats(errorStatsData || []);
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
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
