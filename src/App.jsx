// src/App.jsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './components/Sidebar';

const drawerWidth = 280;

function App() {
  // State untuk mengontrol buka/tutup sidebar di mobile
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hook untuk mendeteksi ukuran layar
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fungsi untuk toggle sidebar
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar (Header Atas) */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          // Atur lebar dan margin agar tidak menimpa sidebar di desktop
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'background.paper',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <Toolbar>
          {/* Tombol Hamburger Menu (hanya tampil di mobile) */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
          {/* Anda bisa menambahkan judul halaman di sini jika perlu */}
          <Typography variant="h6" noWrap component="div" color="text.primary">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Komponen Sidebar */}
      <Sidebar
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
      />

      {/* Kontainer Konten Utama */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#F9FAFB',
          minHeight: '100vh',
        }}
      >
        {/* Toolbar kosong ini berfungsi sebagai 'spacer' agar konten tidak tertutup AppBar */}
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;