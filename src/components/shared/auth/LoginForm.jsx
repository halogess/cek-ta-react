// src/components/login/LoginForm.jsx

import React from 'react';
import { Box, Typography, TextField, Button, Stack, FormControl, FormHelperText } from '@mui/material';

const LoginForm = ({ nrp, setNrp, password, setPassword, handleSubmit, error }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        p: { xs: 3, md: 5 },
      }}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{width:'100%'}}>
        <Stack spacing={3} sx={{ width: '100%' }}>
          <Stack spacing={1}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Sign In
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gunakan NRP dan password Anda untuk masuk.
            </Typography>
          </Stack>
          
          <FormControl error={!!error.nrp} fullWidth>
            <Typography variant="subtitle2" component="label" htmlFor="nrp" fontWeight="medium" mb={0.5}>
              NRP
            </Typography>
            <TextField
              id="nrp"
              placeholder="Masukkan NRP Anda"
              value={nrp}
              onChange={(e) => setNrp(e.target.value)}
            />
            {error.nrp && <FormHelperText>{error.nrp}</FormHelperText>}
          </FormControl>

          <FormControl error={!!error.password} fullWidth>
            <Typography variant="subtitle2" component="label" htmlFor="password" fontWeight="medium" mb={0.5}>
              Password
            </Typography>
            <TextField
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error.password && <FormHelperText>{error.password}</FormHelperText>}
          </FormControl>

          <Button type="submit" fullWidth variant="contained" size="large" sx={{ py: 1.5 }} >
            Masuk
          </Button>

          <Typography variant="body2" pt={1} textAlign="center" color="text.secondary">
            Demo: Gunakan <strong>admin/admin</strong> untuk akses admin
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginForm;