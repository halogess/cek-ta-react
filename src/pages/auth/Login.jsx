// src/pages/auth/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Grid } from '@mui/material';
import BrandingPanel from '../../components/login/BrandingPanel';
import LoginForm from '../../components/login/LoginForm';

const Login = () => {
  const navigate = useNavigate();
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
      navigate('/home');
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
          {/* Kolom Kiri (Panel Biru) - Diperbaiki dari md={2} menjadi md={5} */}
          <Grid
            item
            // md={5} // DIUBAH: dari 2 menjadi 5
      
            sx={{
              width: "40%",
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <BrandingPanel />
          </Grid>

          {/* Kolom Kanan (Form Putih) - Diperbaiki dari md={7} menjadi md={7} */}
          <Grid item xs={12} lg={7} sx={{ display: 'flex',  width: {xs:'100%', sm:'60%'}, }}> 
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