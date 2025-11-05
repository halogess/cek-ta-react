/**
 * Login Page - Halaman authentication untuk admin dan mahasiswa
 * Menampilkan form login dengan branding panel
 * Redirect ke dashboard sesuai role setelah login berhasil
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Grid } from '@mui/material';
import BrandingPanel from '../../components/shared/auth/BrandingPanel';
import LoginForm from '../../components/shared/auth/LoginForm';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/userSlice';
import { authService, handleApiError } from '../../services';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State untuk form input
  const [nrp, setNrp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});

  /**
   * Handle login submit
   * - Validasi input
   * - Call API login
   * - Simpan ke Redux
   * - Redirect ke dashboard
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validasi input
    const newErrors = {};
    if (!nrp) newErrors.nrp = 'NRP tidak boleh kosong.';
    if (!password) newErrors.password = 'Password tidak boleh kosong.';
    setError(newErrors);
    
    // Jika validasi lolos, lakukan login
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await authService.login(nrp, password);
        // Simpan ke Redux dan localStorage
        dispatch(loginSuccess({ user: response.user.nrp, role: response.user.role, token: response.token }));
        // Redirect sesuai role
        navigate(response.user.role === 'admin' ? '/admin' : '/mahasiswa');
      } catch (error) {
        const errorInfo = handleApiError(error);
        setError({ general: errorInfo.message });
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: 'url("https://i.pinimg.com/736x/b2/90/c8/b290c8fbb34d9880048409d1face21a1.jpg?w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        p: 2,
      }}
    >
      <Paper
        elevation={5}
        sx={{
          width: '100%',
          maxWidth: '960px',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <Grid container>
          <Grid
            item
            sx={{
              width: "40%",
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <BrandingPanel />
          </Grid>

          <Grid item xs={12} lg={7} sx={{ display: 'flex', width: { xs: '100%', sm: '60%' }, }}>
            <LoginForm
              nrp={nrp}
              setNrp={setNrp}
              password={password}
              setPassword={setPassword}
              handleSubmit={handleLogin}
              error={error}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Login;