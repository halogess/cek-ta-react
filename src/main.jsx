import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { HeaderProvider } from './context/HeaderContext';
import './index.css';

import App from './App';
import Login from './pages/auth/Login';
import MahasiswaDashboard from './pages/mahasiswa/Dashboard';
import CekDokumen from './pages/mahasiswa/CekDokumen';
import ValidasiBukuLengkap from './pages/mahasiswa/ValidasiBukuLengkap';
import DetailValidation from './pages/mahasiswa/DetailValidation';
import MahasiswaTemplatePanduan from './pages/mahasiswa/TemplatePanduan';
import AdminDashboard from './pages/admin/Dashboard';
import AdminTemplatePanduan from './pages/admin/TemplatePanduan';
import RiwayatValidasi from './pages/admin/RiwayatValidasi';
import AdminDetailValidation from './pages/admin/DetailValidation';
import HapusRiwayat from './pages/admin/HapusRiwayat';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/mahasiswa',
    element: <App />,
    children: [
      { index: true, element: <MahasiswaDashboard /> },
      { path: 'dokumen', element: <CekDokumen /> },
      { path: 'buku', element: <ValidasiBukuLengkap /> },
      { path: 'template', element: <MahasiswaTemplatePanduan /> },
      { path: 'detail/:id', element: <DetailValidation /> }
    ],
  },
  {
    path: '/admin',
    element: <App />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'template', element: <AdminTemplatePanduan /> },
      { path: 'history', element: <RiwayatValidasi /> },
      { path: 'detail/:id', element: <AdminDetailValidation /> },
      { path: 'hapus-riwayat', element: <HapusRiwayat /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <HeaderProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </HeaderProvider>
    </Provider>
  </StrictMode>
);