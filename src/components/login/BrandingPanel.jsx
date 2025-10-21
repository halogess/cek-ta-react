// src/components/login/BrandingPanel.jsx

import { Box, Typography, Stack, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { FactCheckOutlined, SchoolOutlined, BuildOutlined } from '@mui/icons-material';

const BrandingPanel = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        p: { xs: 3, md: 5 },
        color: 'white',
        background: 'linear-gradient(160deg, #1D4ED8 0%, #3B82F6 100%)',
      }}
    >
      <Stack spacing={4}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 52,
              height: 52,
              borderRadius: '12px',
              background: 'linear-gradient(145deg, #60A5FA, #3B82F6)',
            }}
          >
            <FactCheckOutlined sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" component="h1" fontWeight="bold">
              DocValidator
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Sistem Validasi Dokumen TA/Tesis
            </Typography>
          </Box>
        </Stack>

        <List sx={{ p: 0 }}>
          <ListItem sx={{ alignItems: 'flex-start', p: 0, mb: 2 }}>
            <ListItemIcon sx={{ minWidth: 36, mt: 0.5, color: 'white' }}>
              <SchoolOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText

              primary={<Typography fontWeight="medium">Validasi Otomatis</Typography>}
              secondary={<Typography variant="body" sx={{ opacity: 0.8 }}>Sistem akan memeriksa format dokumen Anda secara otomatis sesuai panduan institusi.</Typography>}
            />
          </ListItem>
          <ListItem sx={{ alignItems: 'flex-start', p: 0 }}>
            <ListItemIcon sx={{ minWidth: 36, mt: 0.5, color: 'white' }}>
              <BuildOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography fontWeight="medium">Rekomendasi Perbaikan</Typography>}
              secondary={<Typography variant="body2" sx={{ opacity: 0.8 }}>Dapatkan panduan lengkap untuk memperbaiki kesalahan format dokumen.</Typography>}
            />
          </ListItem>
        </List>
      </Stack>
    </Box>
  );
};

export default BrandingPanel;