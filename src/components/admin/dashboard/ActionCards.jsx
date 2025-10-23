import { Box, Paper, Typography, Button, Stack } from '@mui/material';
import { DescriptionOutlined, EditOutlined, HistoryOutlined } from '@mui/icons-material';

export default function ActionCards() {
  const actionCards = [
    {
      title: 'Template Panduan',
      description: 'Kelola template dokumen',
      icon: <DescriptionOutlined />,
      color: 'primary',
      buttonText: 'Kelola Template'
    },
    {
      title: 'Editor Aturan',
      description: 'Edit aturan format dokumen',
      icon: <EditOutlined />,
      color: 'info',
      buttonText: 'Buka Editor'
    },
    {
      title: 'Riwayat Mahasiswa',
      description: 'Lihat aktivitas validasi',
      icon: <HistoryOutlined />,
      color: 'secondary',
      buttonText: 'Lihat Riwayat'
    }
  ];

  return (
    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      {actionCards.map((card, index) => (
        <Box key={index} sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '250px' }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', height: '100%' }}>
            <Stack spacing={1.5} sx={{ height: '100%' }}>
              <Box>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  {card.title}
                </Typography>
                <Typography color="text.secondary">
                  {card.description}
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                variant="contained"
                color={card.color}
                startIcon={card.icon}
                fullWidth
                sx={{ borderRadius: '8px' }}
              >
                {card.buttonText}
              </Button>
            </Stack>
          </Paper>
        </Box>
      ))}
    </Box>
  );
}
