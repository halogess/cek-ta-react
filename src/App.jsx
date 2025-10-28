/**
 * Layout utama aplikasi dengan sidebar dan header
 * Komponen ini membungkus semua halaman dengan layout yang konsisten
 * dan menangani responsive behavior untuk mobile/desktop
 */

import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, useTheme, useMediaQuery, Toolbar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './redux/userSlice';
import { useHeader } from './context/HeaderContext';
import Sidebar from './components/shared/layout/Sidebar';
import AppHeader from './components/shared/layout/AppHeader';
import { userService } from './services';

// Konstanta lebar drawer/sidebar
const drawerWidth = 280;

function App() {
  // State untuk kontrol sidebar mobile (overlay)
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // State untuk kontrol sidebar desktop (collapse/expand)
  const [desktopOpen, setDesktopOpen] = useState(true);
  
  // Hooks untuk responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Redux hooks untuk state management dan navigation
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ambil data user dari Redux store
  const { role, user } = useSelector((state) => state.user);
  
  // Ambil info header dari context
  const { headerInfo } = useHeader();

  // Scroll ke atas setiap kali route berubah
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // State untuk nama user yang ditampilkan di header
  const [displayName, setDisplayName] = useState(role === 'admin' ? 'Administrator' : 'Mahasiswa');

  // Fetch nama lengkap mahasiswa dari API
  useEffect(() => {
    const fetchUserName = async () => {
      // Hanya fetch untuk mahasiswa, admin tetap "Administrator"
      if (role !== 'admin' && user) {
        try {
          const userData = await userService.getUserByNrp(user);
          setDisplayName(userData.nama);
        } catch (error) {
          // Fallback jika gagal fetch
          setDisplayName('Mahasiswa');
        }
      }
    };
    fetchUserName();
  }, [role, user]);

  // Handler untuk toggle sidebar (mobile: overlay, desktop: collapse)
  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  // Handler untuk logout - clear Redux state dan redirect ke login
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Header dengan menu toggle dan user info */}
      <AppHeader
        desktopOpen={desktopOpen}
        onDrawerToggle={handleDrawerToggle}
        headerTitle={headerInfo.title}
        displayName={displayName}
        onLogout={handleLogout}
      />

      {/* Sidebar dengan menu navigasi */}
      <Sidebar
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        desktopOpen={desktopOpen}
        onDrawerToggle={handleDrawerToggle}
      />

      {/* Main content area - tempat render nested routes */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
        <Toolbar /> {/* Spacer untuk offset header */}
        <Outlet /> {/* Render nested routes di sini */}
      </Box>
    </Box>
  );
}

export default App;