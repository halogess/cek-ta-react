import { AppBar, Toolbar, Button, Container } from '@mui/material'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <AppBar position="static">
      <Container>
        <Toolbar sx={{ gap: 2 }}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <Button color="inherit" component={Link} to="/admin">Admin</Button>
          <Button color="inherit" component={Link} to="/mahasiswa">Mahasiswa</Button>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
