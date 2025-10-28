import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Box, Typography } from '@mui/material';
import { CloseOutlined, SaveOutlined } from '@mui/icons-material';

export default function ExtractedRulesDialog({ open, onClose, rules, onSave }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="600">Aturan Format yang Diekstrak</Typography>
        <Typography variant="body2" color="text.secondary">
          Berikut adalah aturan format yang berhasil diekstrak dari template
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          {rules.map((rule, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <Typography variant="body2" fontWeight="medium">{rule.name}</Typography>
              <Typography variant="body2" color="text.secondary">{rule.value}</Typography>
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button variant="outlined" startIcon={<CloseOutlined />} onClick={onClose}>Batal</Button>
        <Button variant="contained" startIcon={<SaveOutlined />} onClick={onSave}>Simpan</Button>
      </DialogActions>
    </Dialog>
  );
}
