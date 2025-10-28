import { useRef, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import { renderAsync } from 'docx-preview';

export default function TemplatePreviewDialog({ open, onClose, template }) {
  const previewContainerRef = useRef(null);

  useEffect(() => {
    if (open && previewContainerRef.current && template) {
      loadDocument();
    }
  }, [open, template]);

  const loadDocument = async () => {
    try {
      const response = await fetch(template.fileUrl);
      if (!response.ok) throw new Error('File tidak ditemukan');
      const blob = await response.blob();
      previewContainerRef.current.innerHTML = '';
      await renderAsync(blob, previewContainerRef.current);
    } catch (error) {
      console.error('Error loading document:', error);
    }
  };

  const handleClose = () => {
    if (previewContainerRef.current) {
      previewContainerRef.current.innerHTML = '';
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="600">
          Preview Template: {template?.name}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box 
          ref={previewContainerRef} 
          sx={{ 
            minHeight: '600px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            p: 2,
            bgcolor: '#fff',
            overflow: 'auto'
          }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose}>Tutup</Button>
      </DialogActions>
    </Dialog>
  );
}
