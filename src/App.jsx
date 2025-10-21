// src/App.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar'; // KUNCI: Impor komponen Sidebar yang baru

const drawerWidth = 280; // Lebar sidebar (sesuaikan dengan yang ada di Sidebar.jsx)

function App() {
  return (
    // Gunakan Box dengan display: 'flex' untuk layout kiri-kanan
    <Box sx={{ display: 'flex' }}>
      
      {/* Bagian Kiri: Sidebar */}
      <Sidebar />

      {/* Bagian Kanan: Konten Halaman Utama */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Mengisi sisa ruang
          p: 3, // Memberi padding pada area konten
          width: `calc(100% - ${drawerWidth}px)`, // Lebar sisa setelah dikurangi sidebar
          minHeight: '100vh',
          backgroundColor: '#F9FAFB', // Warna latar abu-abu terang
        }}
      >
        {/* Di sinilah halaman (seperti Home, dll.) akan dirender oleh React Router */}
        <Outlet />
      </Box>

    </Box>
  );
}

export default App;