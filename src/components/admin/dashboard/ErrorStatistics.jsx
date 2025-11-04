import { Box, Paper, Typography, Stack } from '@mui/material';
import { PeopleOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function ErrorStatistics({ errorStats = [], usersByProdi = {} }) {
  const navigate = useNavigate();
  const maxUsers = Math.max(...Object.values(usersByProdi), 1);

  return (
    <Stack spacing={3}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Kesalahan Terbanyak
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Jenis kesalahan format yang paling sering ditemukan
          </Typography>
        </Box>
        <Stack spacing={2.5}>
          {errorStats.map((stat, index) => (
            <Box key={index}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight="medium">{stat.name}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.count} kasus ({stat.percentage}%)</Typography>
              </Box>
              <Box sx={{ width: '100%', height: 8, bgcolor: '#E2E8F0', borderRadius: 1, overflow: 'hidden' }}>
                <Box sx={{ width: `${stat.percentage}%`, height: '100%', bgcolor: 'primary.main' }} />
              </Box>
            </Box>
          ))}
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '8px',
            bgcolor: '#EEF2FF',
            color: '#3B82F6'
          }}>
            <PeopleOutlined />
          </Box>
          <Typography variant="h6" fontWeight="600">Pengguna per Program Studi</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-end', justifyContent: 'space-around', minHeight: 200 }}>
          {Object.entries(usersByProdi).map(([prodi, count]) => (
            <Box 
              key={prodi} 
              onClick={() => navigate(`/admin/history?prodi=${prodi}`)}
              sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 1,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <Typography variant="h5" fontWeight="bold" color="#3B82F6">{count}</Typography>
              <Box sx={{ 
                width: '100%', 
                height: `${(count / maxUsers) * 150}px`,
                minHeight: 40,
                bgcolor: '#3B82F6',
                borderRadius: '8px 8px 0 0',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                pb: 1,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: '#2563EB'
                }
              }} />
              <Typography variant="body2" fontWeight="medium" textAlign="center" sx={{ wordBreak: 'break-word' }}>{prodi}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Stack>
  );
}
