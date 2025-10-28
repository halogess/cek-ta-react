/**
 * Sidebar Component - Navigation sidebar dengan responsive behavior
 * - Mobile: Temporary drawer (overlay)
 * - Desktop: Persistent drawer (collapsible)
 * Menu items berbeda untuk admin dan mahasiswa
 */

import { NavLink } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Stack } from '@mui/material';
import { FactCheckOutlined } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import Wave from '../ui/Wave';
import { mahasiswaMenuItems, adminMenuItems } from './menuItems';

const drawerWidth = 280;

const Sidebar = ({ isMobile, mobileOpen, desktopOpen, onDrawerToggle }) => {
    // Ambil role dari Redux untuk menentukan menu items
    const { role } = useSelector((state) => state.user);
    const menuItems = role === 'admin' ? adminMenuItems : mahasiswaMenuItems;

    // Konten drawer yang sama untuk mobile dan desktop
    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Wave /> {/* Background wave animation */}
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1, zIndex: 1 }}>
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
                            Docx Validator
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7, color: '#FFFFFF' }}>
                            {role === 'admin' ? 'Administrator' : 'Mahasiswa'}
                        </Typography>
                    </Box>
                </Stack>

                {/* Bagian Menu */}
                <Typography
                    variant="caption"
                    fontWeight="bold"
                    sx={{ pl: 2, textTransform: 'uppercase', opacity: 0.9, color: '#FFFFFF' }}
                >
                    Menu
                </Typography>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ my: 0.5 }}>
                            <ListItemButton
                                component={NavLink}
                                to={item.path}
                                end
                                onClick={isMobile ? onDrawerToggle : undefined}
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
                                <ListItemIcon sx={{ color: '#FFFFFF', minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    sx={{ color: '#FFFFFF', minWidth: 40 }}
                                    primary={<Typography fontWeight="medium">{item.text}</Typography>}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{ flexShrink: { md: 0 } }}
        >
            {/* Drawer untuk Mobile (Temporary) */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,

                        background: 'linear-gradient(160deg, #111827 0%, #1E40AF 100%)',
                        borderRight: 'none',
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Drawer untuk Desktop (Persistent) */}
            <Drawer
                variant="persistent"
                open={desktopOpen}
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: desktopOpen ? drawerWidth : 0,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        background: 'linear-gradient(160deg, #111827 0%, #1E40AF 100%)',
                        borderRight: 'none',
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default Sidebar;