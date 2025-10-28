import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const StatCard = ({ title, value, subtitle, icon, iconColor, action }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      height: '100%',
      minHeight: '120px',
      width: '100%'
    }}
  >
    <Box sx={{ flex: 1, minWidth: 0, pr: 2 }}>
      <Typography color="text.secondary" variant="body2">{title}</Typography>
      <Typography variant="h4" fontWeight="bold" sx={{ my: 0.5, wordBreak: 'break-word', fontSize: value?.length > 15 ? '0.95rem' : '2.125rem' }}>{value}</Typography>
      <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
      {action}
    </Box>
    <Box sx={{ color: iconColor, display: 'flex', alignItems: 'center', flexShrink: 0, '& .MuiSvgIcon-root': { fontSize: '40px' } }}>
      {icon}
    </Box>
  </Paper>
);

export default StatCard;