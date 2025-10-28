import { Box, Typography, Stack, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { FactCheckOutlined, SchoolOutlined, BuildOutlined } from '@mui/icons-material';
import Wave from '../ui/Wave';

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
        background: 'linear-gradient(160deg, #111827 0%, #1E40AF 100%)',
      }}
    >
      <Wave height="130px" />

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