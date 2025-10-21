import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Impor komponen dan tema
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';

// Impor Halaman
import './index.css';
import App from './App.jsx'; // Layout utama (dengan Navbar/Sidebar)
import Login from './pages/auth/Login.jsx';
import Home from './pages/Home.jsx';
import MahasiswaDashboard from './pages/mahasiswa/Dashboard.jsx';
import NotFound from './pages/NotFound.jsx'; // Halaman 404 yang akan kita buat

const router = createBrowserRouter([
  // Rute Induk untuk Layout Utama (semua halaman yang butuh Navbar/Sidebar)
  {
    element: <App />,
    // Tambahkan errorElement di sini untuk menangani error dalam layout
    errorElement: <NotFound />, 
    children: [
      { path: '/home', element: <Home /> },
      { path: '/mahasiswa', element: <MahasiswaDashboard /> },
      // Tambahkan rute lain yang memerlukan layout di sini
    ],
  },

  // Rute Level Atas (tidak menggunakan layout App)
  {
    path: '/',
    element: <Login />,
  },
  
  // Rute "Catch-All" untuk 404. Letakkan ini di paling akhir.
  {
    path: '*',
    element: <NotFound />,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);