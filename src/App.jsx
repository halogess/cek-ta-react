// src/App.jsx

import React, { useState } from 'react';
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
import { useHeader } from './context/HeaderContext.jsx';
import Sidebar from './components/shared/layout/Sidebar';

const drawerWidth = 280;

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.user);
  const { headerInfo } = useHeader();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'background.paper',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box>
            <Typography variant="h6" fontWeight="bold" noWrap component="div" color="text.primary">
              {headerInfo.title}
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              startIcon={<PersonOutlineOutlined />}
              sx={{ color: 'text.secondary', textTransform: 'capitalize', fontWeight: 'medium' }}
            >
              {role === 'admin' ? 'Administrator' : 'Mahasiswa'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<LogoutOutlined />}
              onClick={handleLogout}
              sx={{ textTransform: 'capitalize', fontWeight: 'medium' }}
            >
              Keluar
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Sidebar
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
      />

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` }, backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;