import { Dialog, DialogTitle, DialogContent, Button, Box } from '@mui/material';
import RuleEditor from './RuleEditor';

export default function EditRuleDialog({ open, onClose, rules, onUpdate, onToggle, onSave }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Aturan Komponen</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {rules.map((rule, idx) => (
              <RuleEditor key={idx} rule={rule} index={idx} onUpdate={onUpdate} onToggle={onToggle} />
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 2, mt: 2 }}>
            <Button onClick={onClose}>Batal</Button>
            <Button variant="contained" onClick={onSave}>Simpan</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
