// src/pages/auth/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Grid } from '@mui/material';
import BrandingPanel from '../../components/shared/auth/BrandingPanel';
import LoginForm from '../../components/shared/auth/LoginForm';

import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/userSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [nrp, setNrp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});

  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!nrp) newErrors.nrp = 'NRP tidak boleh kosong.';
    if (!password) newErrors.password = 'Password tidak boleh kosong.';
    setError(newErrors);
    if (Object.keys(newErrors).length === 0) {

      const role = nrp.toLowerCase() === 'admin' ? 'admin' : 'mahasiswa';
      // Kirim data ke Redux store
      dispatch(loginSuccess({ user: nrp, role: role }));

      // Arahkan berdasarkan peran
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/mahasiswa'); // default untuk mahasiswa
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