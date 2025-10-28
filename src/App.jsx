import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, IconButton, useTheme, useMediaQuery,
  Button, Stack, Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineOutlined from '@mui/icons-material/PersonOutlineOutlined';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './redux/userSlice';
import { useHeader } from './context/HeaderContext';
import Sidebar from './components/shared/layout/Sidebar';
import { mockUsers } from './data/mockData';

const drawerWidth = 280;

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role, user } = useSelector((state) => state.user);
  const { headerInfo } = useHeader();
  
  const currentUser = role === 'admin' ? null : mockUsers.find(u => u.nrp === user);
  const displayName = role === 'admin' ? 'Administrator' : (currentUser?.nama || 'Mahasiswa');

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
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: desktopOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: desktopOpen ? `${drawerWidth}px` : 0 },
          backgroundColor: 'background.paper',
          borderBottom: '1px solid #E2E8F0',
          transition: 'width 0.3s ease, margin-left 0.3s ease',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box>
            <Typography variant="h6" fontWeight="bold" noWrap component="div" color="text.primary">
              {headerInfo.title}
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={1} alignItems="center" sx={{ whiteSpace: 'nowrap' }}>
            <Button
              startIcon={<PersonOutlineOutlined />}
              sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 'medium', whiteSpace: 'nowrap' }}
            >
              {displayName}
            </Button>
            <Button
              variant="outlined"
              startIcon={<LogoutOutlined />}
              onClick={handleLogout}
              sx={{ textTransform: 'capitalize', fontWeight: 'medium', whiteSpace: 'nowrap' }}
            >
              Keluar
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

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