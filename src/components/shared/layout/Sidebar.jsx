
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
    DescriptionOutlined,
} from '@mui/icons-material';

import { useSelector } from 'react-redux';

const drawerWidth = 280;


const Wave = () => (
    <Box
        sx={{
            position: 'absolute',
            bottom: -1,
            left: 0,
            width: '100%',
            overflow: 'hidden',
            lineHeight: 0,
            transform: 'rotate(180deg)',
            zIndex: 0,
        }}
    >
        <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{
                position: 'relative',
                display: 'block',
                width: 'calc(100% + 1.3px)',
                height: '150px',
            }}
        >
            <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                style={{ fill: '#1E293B' }}
            ></path>
        </svg>
    </Box>
);

const mahasiswaMenuItems = [
    { text: 'Dashboard', icon: <HomeOutlined />, path: '/mahasiswa' },
    { text: 'Unggah Dokumen', icon: <UploadOutlined />, path: '/mahasiswa/upload' },
    { text: 'Template & Panduan', icon: <DescriptionOutlined />, path: '/mahasiswa/template' },
    { text: 'Riwayat', icon: <HistoryOutlined />, path: '/mahasiswa/history' },
];

const adminMenuItems = [
    { text: 'Dashboard', icon: <HomeOutlined />, path: '/admin' },
    { text: 'Template Panduan', icon: <DescriptionOutlined />, path: '/admin/template' },
    { text: 'Riwayat Validasi', icon: <HistoryOutlined />, path: '/admin/history' },
];

const Sidebar = ({ isMobile, mobileOpen, desktopOpen, onDrawerToggle }) => {
    const { role } = useSelector((state) => state.user);
    const menuItems = role === 'admin' ? adminMenuItems : mahasiswaMenuItems;

    const drawerContent = (

        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Wave />
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