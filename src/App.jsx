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

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { role, nama } = useSelector((state) => state.user);
  const { headerInfo } = useHeader();
  const [displayName, setDisplayName] = useState(nama || (role === 'admin' ? 'Administrator' : 'Mahasiswa'));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (nama) setDisplayName(nama);
  }, [nama]);

  const handleDrawerToggle = () => {
    isMobile ? setMobileOpen(!mobileOpen) : setDesktopOpen(!desktopOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppHeader
        desktopOpen={desktopOpen}
        onDrawerToggle={handleDrawerToggle}
        headerTitle={headerInfo.title}
        displayName={displayName}
        onLogout={handleLogout}
      />
      <Sidebar
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        desktopOpen={desktopOpen}
        onDrawerToggle={handleDrawerToggle}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;