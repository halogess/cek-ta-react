import { useRef, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import { renderAsync } from 'docx-preview';

export default function DocumentPreviewDialog({ open, onClose, template, loading, error, onLoadingChange, onErrorChange }) {
  const previewContainerRef = useRef(null);

  useEffect(() => {
    if (open && previewContainerRef.current && template) {
      const loadDocument = async () => {
        try {
          onLoadingChange(true);
          const response = await fetch(template.fileUrl);
          if (!response.ok) throw new Error('File tidak ditemukan');
          const blob = await response.blob();
          previewContainerRef.current.innerHTML = '';
          await renderAsync(blob, previewContainerRef.current);
          onLoadingChange(false);
        } catch (error) {
          console.error('Error loading document:', error);
          onErrorChange(error.message);
          onLoadingChange(false);
        }
      };
      loadDocument();
    }
  }, [open, template]);

  const handleClose = () => {
    if (previewContainerRef.current) {
      previewContainerRef.current.innerHTML = '';
    }
    onErrorChange(null);
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
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '600px' }}>
            <Typography>Loading document...</Typography>
          </Box>
        )}
        {error && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '600px' }}>
            <Typography color="error">Error: {error}</Typography>
          </Box>
        )}
        <Box 
          ref={previewContainerRef} 
          sx={{ 
            minHeight: '600px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            p: 2,
            bgcolor: '#fff',
            overflow: 'auto',
            display: loading || error ? 'none' : 'block'
          }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose}>Tutup</Button>
      </DialogActions>
    </Dialog>
  );
}
