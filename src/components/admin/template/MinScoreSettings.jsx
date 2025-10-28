import { Box, Typography, Stack, Button } from '@mui/material';
import { SaveOutlined } from '@mui/icons-material';

export default function MinScoreSettings({ minScore, onChange, onSave, hasChanges }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" fontWeight="bold">
          Pengaturan Validasi
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Atur minimal skor kelulusan validasi dokumen
        </Typography>
      </Box>
      <Stack direction="row" spacing={3} alignItems="center" sx={{ minWidth: 400 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Minimal Skor</Typography>
            <Typography variant="h6" fontWeight="bold" color="primary.main">{minScore}%</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption" color="text.secondary">0%</Typography>
            <Box sx={{ flex: 1 }}>
              <input
                type="range"
                min="0"
                max="100"
                value={minScore}
                onChange={(e) => onChange(Number(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  outline: 'none',
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${minScore}%, #E2E8F0 ${minScore}%, #E2E8F0 100%)`,
                  WebkitAppearance: 'none',
                  cursor: 'pointer'
                }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">100%</Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveOutlined />}
          onClick={onSave}
          disabled={!hasChanges}
        >
          Update
        </Button>
      </Stack>
    </Box>
  );
}
