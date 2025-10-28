import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { useHeader } from '../../context/HeaderContext';
import StatsCards from '../../components/admin/dashboard/StatsCards';
import ErrorStatistics from '../../components/admin/dashboard/ErrorStatistics';
import SystemInfo from '../../components/admin/dashboard/SystemInfo';
import Loading from '../../components/shared/ui/Loading';
import { dashboardService } from '../../services';

export default function AdminDashboard() {
  const { setHeaderInfo } = useHeader();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHeaderInfo({ title: 'Dashboard' });
    fetchDashboardData();
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        dashboardService.getAdminStats(),
        dashboardService.getErrorStatistics(),
        dashboardService.getSystemInfo()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Memuat dashboard..." />;

  return (
    <Stack spacing={3}>
      <StatsCards />
      <ErrorStatistics />
      <SystemInfo />
    </Stack>
  )
}
