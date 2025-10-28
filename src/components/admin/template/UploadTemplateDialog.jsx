import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography } from '@mui/material';
import { UploadFileOutlined } from '@mui/icons-material';
import FileUploadArea from '../../shared/ui/FileUploadArea';

export default function UploadTemplateDialog({ open, onClose, file, onFileChange, onUpload }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="600">Unggah Template Baru</Typography>
        <Typography variant="body2" color="text.secondary">
          Unggah file .docx panduan format untuk mengekstrak aturan otomatis
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FileUploadArea file={file} onFileChange={onFileChange} />
          <Typography variant="body2" color="text.secondary">
            Sistem akan secara otomatis mengekstrak aturan format dari dokumen yang diunggah
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Batal</Button>
        <Button variant="contained" startIcon={<UploadFileOutlined />} disabled={!file} onClick={onUpload}>
          Unggah
        </Button>
      </DialogActions>
    </Dialog>
  );
}
