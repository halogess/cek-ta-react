// src/pages/auth/Login.jsx

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

  const [nrp, setNrp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!nrp) newErrors.nrp = 'NRP tidak boleh kosong.';
    if (!password) newErrors.password = 'Password tidak boleh kosong.';
    setError(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await authService.login(nrp, password);
        dispatch(loginSuccess({ user: response.user.nrp, role: response.user.role, token: response.token }));
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
        backgroundColor: 'background.default',
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