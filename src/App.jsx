// src/App.jsx

import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar'; // Atau sidebar yang kita buat sebelumnya
import { Box } from '@mui/material';

function App() {
  return (
    // Jika Anda menggunakan Sidebar dari jawaban sebelumnya, gunakan kode itu.
    // Jika Anda hanya menggunakan Navbar sederhana, kode ini cukup.
    <>
      <Navbar />
      {/* Container untuk konten halaman */}
      <Box component="main" sx={{ p: 3 }}>
        <Outlet /> 
        {/* Outlet akan merender komponen anak (Home, MahasiswaDashboard, dll.) */}
      </Box>
    </>
  );
}

export default App;