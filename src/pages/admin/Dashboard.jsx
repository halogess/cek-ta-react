import React, { useEffect } from 'react';
import { Stack } from '@mui/material';
import { useHeader } from '../../context/HeaderContext';
import StatsCards from '../../components/admin/dashboard/StatsCards';
import ActionCards from '../../components/admin/dashboard/ActionCards';
import ErrorStatistics from '../../components/admin/dashboard/ErrorStatistics';
import SystemInfo from '../../components/admin/dashboard/SystemInfo';

export default function AdminDashboard() {
  const { setHeaderInfo } = useHeader();

  useEffect(() => {
    setHeaderInfo({ title: 'Dashboard' });
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo]);

  return (
    <Stack spacing={4}>
      <StatsCards />
      <ActionCards />
      <ErrorStatistics />
      <SystemInfo />
    </Stack>
  )
}
