import { Box, Typography, Stack, Button, Input } from '@mui/material';
import { UploadFileOutlined } from '@mui/icons-material';
import { useRef } from 'react';

export default function FileUploadArea({ file, onFileChange, disabled = false, accept = ".docx" }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        border: file ? '2px solid #3B82F6' : '2px dashed #D1D5DB',
        borderRadius: '12px',
        p: 6,
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: file ? '#F0F9FF' : '#FAFBFC',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s ease',
        '&:hover': { 
          borderColor: disabled ? '#D1D5DB' : 'primary.main',
          backgroundColor: disabled ? '#FAFBFC' : '#F8FAFC'
        }
      }}
    >
      <Box sx={{ mb: 2 }}>
        <UploadFileOutlined sx={{ fontSize: 48, color: file ? 'primary.main' : '#9CA3AF' }} />
      </Box>
      
      {file ? (
        <Stack spacing={1} alignItems="center">
          <Typography variant="h6" fontWeight="medium" color="primary.main">
            {file.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            File siap untuk divalidasi
          </Typography>
          <Button variant="outlined" size="small" sx={{ mt: 1 }}>
            Ganti File
          </Button>
        </Stack>
      ) : (
        <Stack spacing={1} alignItems="center">
          <Typography variant="h6" fontWeight="medium">
            Pilih file dokumen Anda
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Klik di sini atau seret file {accept} ke area ini
          </Typography>
          <Button variant="contained" size="small" sx={{ mt: 2 }}>
            Pilih File
          </Button>
        </Stack>
      )}
      
      <Input
        type="file"
        inputRef={fileInputRef}
        onChange={(e) => {
          onFileChange(e);
          e.target.value = '';
        }}
        sx={{ display: 'none' }}
        inputProps={{ accept }}
      />
    </Box>
  );
}
