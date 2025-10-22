import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const StatCard = ({ title, value, subtitle, icon, iconColor }) => (
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
    <Box>
      <Typography color="text.secondary" variant="body2">{title}</Typography>
      <Typography variant="h4" fontWeight="bold" sx={{ my: 0.5 }}>{value}</Typography>
      <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
    </Box>
    <Box sx={{ color: iconColor, display: 'flex', alignItems: 'center', '& .MuiSvgIcon-root': { fontSize: '40px' } }}>
      {icon}
    </Box>
  </Paper>
);

export default StatCard;