import { AppBar, Toolbar, IconButton, Box, Button, Stack, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineOutlined from '@mui/icons-material/PersonOutlineOutlined';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';

const drawerWidth = 280;

export default function AppHeader({ desktopOpen, onDrawerToggle, headerTitle, displayName, onLogout }) {
  return (
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
          onClick={onDrawerToggle}
          sx={{ mr: 2, color: 'text.primary' }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box>
          <Typography variant="h6" fontWeight="bold" noWrap component="div" color="text.primary">
            {headerTitle}
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
            onClick={onLogout}
            sx={{ textTransform: 'capitalize', fontWeight: 'medium', whiteSpace: 'nowrap' }}
          >
            Keluar
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
