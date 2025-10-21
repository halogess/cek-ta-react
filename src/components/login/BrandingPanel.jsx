// src/components/login/BrandingPanel.jsx

import { Box, Typography, Stack, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { FactCheckOutlined, SchoolOutlined, BuildOutlined } from '@mui/icons-material';

// Komponen SVG untuk gelombang di bagian bawah
const Wave = () => (
  <Box
    sx={{
      position: 'absolute',
      bottom: -1,
      left: 0,
      width: '100%',
      overflow: 'hidden',
      lineHeight: 0,
      transform: 'rotate(180deg)',
    }}
  >
    <svg
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      style={{
        position: 'relative',
        display: 'block',
        width: 'calc(100% + 1.3px)',
        height: '130px',
      }}
    >
      <path
        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
        // KUNCI: Warna gelombang diubah menjadi warna gelap yang subtil
        style={{ fill: '#1E293B' }}
      ></path>
    </svg>
  </Box>
);

const BrandingPanel = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        p: { xs: 3, md: 5 },
        color: 'white',
        // KUNCI: Latar belakang diubah menjadi GRADIENT BIRU GELAP
        background: 'linear-gradient(160deg, #111827 0%, #1E40AF 100%)',
      }}
    >
      <Wave />

      <Stack spacing={4} sx={{ zIndex: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 52,
              height: 52,
              borderRadius: '12px',
              // Aksen biru cerah pada logo tetap dipertahankan untuk kontras
              background: 'linear-gradient(145deg, #60A5FA, #3B82F6)',
            }}
          >
            <FactCheckOutlined sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" component="h1" fontWeight="bold">
              Docx Validator
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, color: '#FFFFFF' }}>
              Sistem Validasi Dokumen TA/Tesis
            </Typography>
          </Box>
        </Stack>

        <List sx={{ p: 0, maxWidth: '100%' }}>
          <ListItem sx={{ alignItems: 'flex-start', p: 0, mb: 2 }}>
            <ListItemIcon sx={{ minWidth: 36, mt: 0.5, color: '#9CA3AF' }}>
              <SchoolOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography fontWeight="medium" color="white">Validasi Otomatis</Typography>}
              secondary={<Typography variant="body2" sx={{ opacity: 0.8, color: '#FFFFFF' }}>
                Sistem akan memeriksa format dokumen Anda secara otomatis sesuai panduan institusi.
              </Typography>}
            />
          </ListItem>
          <ListItem sx={{ alignItems: 'flex-start', p: 0 }}>
            <ListItemIcon sx={{ minWidth: 36, mt: 0.5, color: '#9CA3AF' }}>
              <BuildOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Rekomendasi Perbaikan"
              secondary={<Typography variant="body2" sx={{ opacity: 0.8, color: '#FFFFFF' }}>
                Dapatkan panduan lengkap untuk memperbaiki kesalahan format dokumen.
              </Typography>}
            />
          </ListItem>
        </List>
      </Stack>
    </Box>
  );
};

export default BrandingPanel;