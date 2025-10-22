import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Impor komponen dan tema
import CssBaseline from '@mui/material/CssBaseline';

import { Provider } from 'react-redux';
import { store } from './redux/store';
import { HeaderProvider } from './context/HeaderContext.jsx';

// Impor Halaman
import './index.css';
import App from './App.jsx';
import Login from './pages/auth/Login.jsx';
import MahasiswaDashboard from './pages/mahasiswa/Dashboard.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import NotFound from './pages/NotFound.jsx';
import Upload from './pages/mahasiswa/Upload.jsx';
import History from './pages/mahasiswa/History.jsx';
import DetailValidation from './pages/mahasiswa/DetailValidation.jsx';

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
      { path: 'history', element: <History /> },
      { path: 'detail/:id', element: <DetailValidation /> }
    ],
  },
  {
    path: '/admin',
    element: <App />,
    children: [
      { index: true, element: <AdminDashboard /> },
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