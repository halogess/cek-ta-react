import { Box, Typography, IconButton, Chip, Button, Stack } from '@mui/material';
import { DescriptionOutlined, EditOutlined, VisibilityOutlined, DownloadOutlined, DeleteOutlined } from '@mui/icons-material';

export default function TemplateCard({ 
  template, 
  isSelected, 
  onSelect, 
  onEdit, 
  onPreview, 
  onDownload, 
  onDelete, 
  onActivate 
}) {
  return (
    <Box
      onClick={onSelect}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        border: isSelected ? '2px solid #3B82F6' : '1px solid #E2E8F0',
        borderRadius: '12px',
        bgcolor: isSelected ? '#EFF6FF' : '#FAFBFC',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: '#3B82F6',
          bgcolor: '#F0F9FF'
        }
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '8px',
          bgcolor: '#E3F2FD',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <DescriptionOutlined sx={{ color: 'primary.main', fontSize: 28 }} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography variant="body1" fontWeight="600">
            {template.name}
          </Typography>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            <EditOutlined sx={{ fontSize: 16 }} />
          </IconButton>
          {template.isActive && (
            <Chip label="Aktif" size="small" color="success" sx={{ height: 20 }} />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          Versi: {template.version} • {template.rules} aturan • Diunggah: {template.date}
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0, minWidth: '280px', justifyContent: 'flex-end' }}>
        {!template.isActive && (
          <Button
            variant="outlined"
            size="small"
            onClick={(e) => { e.stopPropagation(); onActivate(); }}
          >
            Aktifkan
          </Button>
        )}
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onPreview(); }}>
          <VisibilityOutlined />
        </IconButton>
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDownload(); }}>
          <DownloadOutlined />
        </IconButton>
        {!template.isActive && (
          <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <DeleteOutlined />
          </IconButton>
        )}
      </Stack>
    </Box>
  );
}
