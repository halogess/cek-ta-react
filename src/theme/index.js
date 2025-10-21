// src/theme/index.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2563EB', // Biru yang lebih modern
    },
    background: {
      default: '#F4F6F8', // Latar belakang abu-abu muda
      paper: '#FFFFFF',    // Latar belakang untuk elemen seperti kartu
    },
    text: {
        primary: '#172B4D',
        secondary: '#6B778C',
    }
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.5rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          padding: '10px 24px',
          fontWeight: 600,
        },
      },
    },
    MuiOutlinedInput: {
        styleOverrides: {
            root: {
                borderRadius: '8px',
            }
        }
    }
  },
});