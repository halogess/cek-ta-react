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
import AdminDashboard from './pages/admin/Dashboard';
import AdminTemplatePanduan from './pages/admin/TemplatePanduan';
import MahasiswaTemplatePanduan from './pages/mahasiswa/TemplatePanduan';
import AdminHistory from './pages/admin/History';
import AdminDetailValidation from './pages/admin/DetailValidation';
import NotFound from './pages/NotFound';
import Upload from './pages/mahasiswa/Upload';
import History from './pages/mahasiswa/History';
import DetailValidation from './pages/mahasiswa/DetailValidation';

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
      { path: 'upload', element: <Upload /> },
      { path: 'template', element: <MahasiswaTemplatePanduan /> },
      { path: 'history', element: <History /> },
      { path: 'detail/:id', element: <DetailValidation /> }
    ],
  },
  {
    path: '/admin',
    element: <App />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'template', element: <AdminTemplatePanduan /> },
      { path: 'history', element: <AdminHistory /> },
      { path: 'detail/:id', element: <AdminDetailValidation /> },
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