import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';

export default function SaveConfirmDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="600">Konfirmasi Simpan Perubahan</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2, bgcolor: '#FFF3CD', borderRadius: '8px', border: '1px solid #FFE69C', mb: 2 }}>
          <Typography variant="body2" color="#856404" fontWeight="600" gutterBottom>⚠️ Peringatan</Typography>
          <Typography variant="body2" color="#856404">
            Perubahan yang Anda lakukan akan mengubah aturan format dari template asli. Pastikan perubahan sudah sesuai dengan kebutuhan.
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">Apakah Anda yakin ingin menyimpan perubahan ini?</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Batal</Button>
        <Button variant="contained" onClick={onConfirm}>Simpan</Button>
      </DialogActions>
    </Dialog>
  );
}
