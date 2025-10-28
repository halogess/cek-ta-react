import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

export default function EditNameDialog({ open, onClose, name, onNameChange, onSave }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Nama Template</DialogTitle>
      <DialogContent>
        <TextField autoFocus fullWidth label="Nama Template" value={name} onChange={(e) => onNameChange(e.target.value)} sx={{ mt: 2 }} />
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Batal</Button>
        <Button variant="contained" onClick={onSave}>Simpan</Button>
      </DialogActions>
    </Dialog>
  );
}
