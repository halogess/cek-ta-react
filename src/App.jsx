import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, useTheme, useMediaQuery, Toolbar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './redux/userSlice';
import { useHeader } from './context/HeaderContext';
import Sidebar from './components/shared/layout/Sidebar';
import AppHeader from './components/shared/layout/AppHeader';
import { userService } from './services';

const drawerWidth = 280;

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { role, user } = useSelector((state) => state.user);
  const { headerInfo } = useHeader();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const [displayName, setDisplayName] = useState(role === 'admin' ? 'Administrator' : 'Mahasiswa');

  useEffect(() => {
    const fetchUserName = async () => {
      if (role !== 'admin' && user) {
        try {
          const userData = await userService.getUserByNrp(user);
          setDisplayName(userData.nama);
        } catch (error) {
          setDisplayName('Mahasiswa');
        }
      }
    };
    fetchUserName();
  }, [role, user]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
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