import { Box, Typography, IconButton, Chip, Stack, Card, CardContent } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';

export default function FormatRuleCard({ item, onEdit, onToggleRule, type }) {
  return (
    <Box sx={{ flex: '0 0 calc(33.333% - 11px)', display: 'flex' }}>
      <Card sx={{ 
        width: '100%',
        border: '1px solid #E2E8F0', 
        boxShadow: 'none', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <CardContent sx={{ flex: 1, overflow: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1" fontWeight="600">
              {item.description || item.name}
            </Typography>
            <IconButton size="small" onClick={onEdit}>
              <EditOutlined sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
          <Stack spacing={0.5}>
            {item.rules.map((rule, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    flex: 1, 
                    textDecoration: rule.enabled ? 'none' : 'line-through', 
                    opacity: rule.enabled ? 1 : 0.5, 
                    fontSize: '0.8rem' 
                  }}
                >
                  • {rule.value}
                </Typography>
                <Chip 
                  label={rule.enabled ? 'Aktif' : 'Nonaktif'} 
                  size="small" 
                  color={rule.enabled ? 'success' : 'default'}
                  onClick={() => onToggleRule(type, item.id, idx)}
                  sx={{ height: 18, fontSize: '0.7rem', cursor: 'pointer' }}
                />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
