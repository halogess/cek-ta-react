import { Snackbar, Alert } from '@mui/material';

export default function NotificationSnackbar({ open, onClose, message, severity = "success" }) {
  return (
    <Snackbar 
      open={open} 
      autoHideDuration={3000} 
      onClose={onClose} 
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ 
        left: { xs: '50%', md: 'calc(50% + 140px)' },
        transform: 'translateX(-50%)',
        top: '80px !important',
        right: 'auto !important'
      }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
