import { Box, Typography, Button, Stack } from '@mui/material';
import { SaveOutlined, CloseOutlined } from '@mui/icons-material';
import FormatRuleCard from './FormatRuleCard';

export default function FormatRulesSection({ 
  selectedTemplate, 
  hasChanges, 
  onCancelChanges, 
  onSaveChanges,
  onEditRule,
  onToggleRule 
}) {
  const allRules = [
    ...(selectedTemplate?.formatRules?.page_settings?.flatMap(s => s.rules) || []),
    ...(selectedTemplate?.formatRules?.components?.flatMap(c => c.rules) || [])
  ];
  const activeRules = allRules.filter(r => r.enabled).length;

  return (
    <Box sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0', bgcolor: '#fff' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Panduan Format Buku
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Aturan format dari template: <strong>{selectedTemplate?.name}</strong>
          </Typography>
          <Typography color="text.secondary">
            {activeRules} / {allRules.length} aturan diaktifkan
          </Typography>
        </Box>
        {hasChanges && (
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<CloseOutlined />} onClick={onCancelChanges}>
              Batalkan
            </Button>
            <Button variant="contained" startIcon={<SaveOutlined />} onClick={onSaveChanges}>
              Simpan Perubahan
            </Button>
          </Stack>
        )}
      </Box>

      <Stack spacing={4}>
        <Box>
          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
            Page Settings
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'stretch' }}>
            {selectedTemplate?.formatRules?.page_settings?.map((setting) => (
              <FormatRuleCard
                key={setting.id}
                item={setting}
                type="page_settings"
                onEdit={() => onEditRule('page_settings', setting.id)}
                onToggleRule={onToggleRule}
              />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
            Components
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'stretch' }}>
            {selectedTemplate?.formatRules?.components?.map((component) => (
              <FormatRuleCard
                key={component.id}
                item={component}
                type="components"
                onEdit={() => onEditRule('components', component.id)}
                onToggleRule={onToggleRule}
              />
            ))}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
