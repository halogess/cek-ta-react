/**
 * Entry point aplikasi - Konfigurasi routing dan provider
 * File ini mengatur struktur routing untuk admin dan mahasiswa,
 * serta membungkus aplikasi dengan provider yang diperlukan
 */

// Import React core
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Import routing
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import Material-UI
import CssBaseline from '@mui/material/CssBaseline';

// Import Redux untuk state management
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Import Context untuk header
import { HeaderProvider } from './context/HeaderContext';

// Import global styles
import './index.css';

// Import layout utama
import App from './App';

// Import halaman auth
import Login from './pages/auth/Login';

// Import halaman mahasiswa
import MahasiswaDashboard from './pages/mahasiswa/Dashboard';
import Upload from './pages/mahasiswa/Upload';
import History from './pages/mahasiswa/History';
import DetailValidation from './pages/mahasiswa/DetailValidation';
import MahasiswaTemplatePanduan from './pages/mahasiswa/TemplatePanduan';

// Import halaman admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminTemplatePanduan from './pages/admin/TemplatePanduan';
import AdminHistory from './pages/admin/History';
import AdminDetailValidation from './pages/admin/DetailValidation';

// Import halaman error
import NotFound from './pages/NotFound';

// Konfigurasi routing aplikasi dengan nested routes
const router = createBrowserRouter([
  {
    // Route untuk halaman login (public)
    path: '/',
    element: <Login />,
  },
  {
    // Route untuk mahasiswa dengan layout App
    path: '/mahasiswa',
    element: <App />,
    children: [
      { index: true, element: <MahasiswaDashboard /> }, // Dashboard mahasiswa
      { path: 'upload', element: <Upload /> }, // Upload dokumen
      { path: 'template', element: <MahasiswaTemplatePanduan /> }, // Lihat template
      { path: 'history', element: <History /> }, // Riwayat validasi
      { path: 'detail/:id', element: <DetailValidation /> } // Detail validasi
    ],
  },
  {
    // Route untuk admin dengan layout App
    path: '/admin',
    element: <App />,
    children: [
      { index: true, element: <AdminDashboard /> }, // Dashboard admin
      { path: 'template', element: <AdminTemplatePanduan /> }, // Kelola template
      { path: 'history', element: <AdminHistory /> }, // Semua riwayat validasi
      { path: 'detail/:id', element: <AdminDetailValidation /> }, // Detail validasi
    ],
  },
  {
    // Route untuk halaman tidak ditemukan
    path: '*',
    element: <NotFound />,
  }
]);

// Render aplikasi dengan provider hierarchy:
// StrictMode -> Redux Provider -> Header Context -> Material-UI -> Router
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <HeaderProvider>
        <CssBaseline /> {/* Reset CSS Material-UI */}
        <RouterProvider router={router} />
      </HeaderProvider>
    </Provider>
  </StrictMode>
);