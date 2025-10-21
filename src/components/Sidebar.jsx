import { NavLink } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Stack,
} from '@mui/material';
import {
  HomeOutlined,
  UploadOutlined,
  HistoryOutlined,
  FactCheckOutlined,
} from '@mui/icons-material';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <HomeOutlined />, path: '/home' },
  { text: 'Unggah Dokumen', icon: <UploadOutlined />, path: '/upload' },
  { text: 'Riwayat Validasi', icon: <HistoryOutlined />, path: '/history' },
];

// Komponen Sidebar sekarang menerima props untuk mengontrolnya
const Sidebar = ({ isMobile, mobileOpen, onDrawerToggle }) => {
  // Konten sidebar kita ekstrak ke dalam variabel agar bisa digunakan kembali
  const drawerContent = (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Bagian Logo */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '8px',
            background: 'linear-gradient(145deg, #60A5FA, #3B82F6)',
            color: 'white',
          }}
        >
          <FactCheckOutlined sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h6" component="h1" fontWeight="bold" color="white">
            DocValidator
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Mahasiswa
          </Typography>
        </Box>
      </Stack>

      {/* Bagian Menu */}
      <Typography
        variant="caption"
        fontWeight="bold"
        sx={{ pl: 2, textTransform: 'uppercase', opacity: 0.5 }}
      >
        Menu
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ my: 0.5 }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={isMobile ? onDrawerToggle : undefined} // Tutup drawer saat item diklik di mobile
              sx={{
                borderRadius: '8px',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                '&.active': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '& .MuiSvgIcon-root': { color: 'white' },
                },
              }}
            >
              <ListItemIcon sx={{ color: '#D1D5DB', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Drawer untuk Mobile (Temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }} // Optimalisasi untuk mobile
        sx={{
          display: { xs: 'block', md: 'none' }, // Tampil di xs, sembunyi di md
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: '#111827',
            borderRight: 'none',
            color: 'white',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Drawer untuk Desktop (Permanent) */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' }, // Sembunyi di xs, tampil di md
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: '#111827',
            borderRight: 'none',
            color: 'white',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;