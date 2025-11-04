
import { Box, Button, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      textAlign="center"
    >
      <Container maxWidth="md">
        <Typography variant="h1" fontWeight="bold" color="primary">
          404
        </Typography>
        <Typography variant="h5" sx={{ my: 2 }}>
          Halaman Tidak Ditemukan
        </Typography>
        <Typography color="text.secondary">
          Maaf, kami tidak dapat menemukan halaman yang Anda cari.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          sx={{ mt: 4 }}
        >
          Kembali ke Halaman Login
        </Button>
      </Container>
    </Box>
  );
};

export default NotFound;