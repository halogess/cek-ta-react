import { Box, Typography, Chip, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Stack } from '@mui/material';
import { FormatBold, FormatItalic, FormatAlignLeft, FormatAlignCenter, FormatAlignRight, FormatAlignJustify } from '@mui/icons-material';

const parseValue = (value) => {
  const colonIndex = value.indexOf(':');
  if (colonIndex === -1) return { key: '', value: value };
  const key = value.substring(0, colonIndex).trim();
  const val = value.substring(colonIndex + 1).trim();
  
  if (key.toLowerCase() === 'font') {
    const parts = val.split(',').map(p => p.trim());
    const fontName = parts[0] || '';
    const size = parts[1] || '';
    const styles = parts.slice(2).join(', ');
    return { key, fontName, fontSize: size, fontStyle: styles };
  }
  
  const numMatch = val.match(/^([\d.]+)\s*([a-z%]+)?$/i);
  if (numMatch) {
    return { key, number: numMatch[1], unit: numMatch[2] || '' };
  }
  return { key, value: val };
};

const getInputType = (key) => {
  const lowerKey = key.toLowerCase();
  if (lowerKey === 'font') return 'font';
  if (lowerKey.includes('margin') || lowerKey.includes('indent') || lowerKey.includes('spacing')) return 'number';
  if (lowerKey.includes('orientation') || lowerKey.includes('alignment') || lowerKey.includes('case') || lowerKey.includes('position')) return 'select';
  return 'text';
};

const getSelectOptions = (key) => {
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes('orientation')) return ['Portrait', 'Landscape'];
  if (lowerKey.includes('case')) return ['Uppercase', 'Lowercase', 'Capitalize Each Word'];
  if (lowerKey.includes('position')) return ['Above Table', 'Below Image', 'Above Image', 'Below Table'];
  return [];
};

const getAlignmentIcon = (align) => {
  if (align === 'Left') return <FormatAlignLeft />;
  if (align === 'Center') return <FormatAlignCenter />;
  if (align === 'Right') return <FormatAlignRight />;
  if (align === 'Justify') return <FormatAlignJustify />;
  return null;
};

const getUnitOptions = () => ['cm', 'pt', 'px', '%', ''];
const getFontOptions = () => ['Times New Roman', 'Arial', 'Calibri', 'Courier New', 'Cambria Math'];
const getFontSizeOptions = () => ['10pt', '11pt', '12pt', '14pt', '16pt', '18pt', '20pt', '24pt'];

export default function RuleEditor({ rule, index, onUpdate, onToggle }) {
  const parsed = parseValue(rule.value);
  const inputType = getInputType(parsed.key);
  
  const updateRuleValue = (newNumber, newUnit, newValue, fontName, fontSize, fontStyle) => {
    let updatedValue;
    
    if (parsed.fontName !== undefined) {
      const parts = [fontName, fontSize];
      if (fontStyle) parts.push(fontStyle);
      updatedValue = `${parsed.key}: ${parts.join(', ')}`;
    } else if (parsed.number !== undefined) {
      updatedValue = `${parsed.key}: ${newNumber}${newUnit}`;
    } else {
      updatedValue = `${parsed.key}: ${newValue}`;
    }
    
    onUpdate(index, updatedValue);
  };
  
  return (
    <Box sx={{ flex: '0 0 calc(50% - 8px)', p: 1.5, border: '1px solid #E2E8F0', borderRadius: '6px', bgcolor: rule.enabled ? '#fff' : '#F9FAFB' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" fontWeight="600">{parsed.key}</Typography>
        <Chip 
          label={rule.enabled ? 'Aktif' : 'Nonaktif'} 
          size="small" 
          color={rule.enabled ? 'success' : 'default'}
          onClick={() => onToggle(index)}
          sx={{ cursor: 'pointer' }}
        />
      </Box>
      
      {parsed.key.toLowerCase().includes('alignment') ? (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {['Left', 'Center', 'Right', 'Justify'].map(align => (
            <IconButton
              key={align}
              size="small"
              onClick={() => updateRuleValue(null, null, align)}
              disabled={!rule.enabled}
              sx={{ 
                border: '1px solid #E2E8F0',
                bgcolor: parsed.value === align ? '#E3F2FD' : 'transparent'
              }}
            >
              {getAlignmentIcon(align)}
            </IconButton>
          ))}
        </Box>
      ) : inputType === 'font' ? (
        <Stack spacing={0.5}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl size="small" sx={{ flex: 1 }}>
              <InputLabel>Font</InputLabel>
              <Select
                value={parsed.fontName || ''}
                label="Font"
                onChange={(e) => updateRuleValue(null, null, null, e.target.value, parsed.fontSize, parsed.fontStyle)}
                disabled={!rule.enabled}
              >
                {getFontOptions().map(font => (
                  <MenuItem key={font} value={font}>{font}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Size</InputLabel>
              <Select
                value={parsed.fontSize || ''}
                label="Size"
                onChange={(e) => updateRuleValue(null, null, null, parsed.fontName, e.target.value, parsed.fontStyle)}
                disabled={!rule.enabled}
              >
                {getFontSizeOptions().map(size => (
                  <MenuItem key={size} value={size}>{size}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => {
                const styles = parsed.fontStyle?.split(',').map(s => s.trim()) || [];
                const hasBold = styles.includes('Bold');
                let newStyles = hasBold ? styles.filter(s => s !== 'Bold') : [...styles, 'Bold'];
                newStyles = newStyles.filter(s => s);
                updateRuleValue(null, null, null, parsed.fontName, parsed.fontSize, newStyles.join(', '));
              }}
              disabled={!rule.enabled}
              sx={{ 
                border: '1px solid #E2E8F0',
                bgcolor: parsed.fontStyle?.includes('Bold') ? '#E3F2FD' : 'transparent'
              }}
            >
              <FormatBold />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                const styles = parsed.fontStyle?.split(',').map(s => s.trim()) || [];
                const hasItalic = styles.includes('Italic');
                let newStyles = hasItalic ? styles.filter(s => s !== 'Italic') : [...styles, 'Italic'];
                newStyles = newStyles.filter(s => s);
                updateRuleValue(null, null, null, parsed.fontName, parsed.fontSize, newStyles.join(', '));
              }}
              disabled={!rule.enabled}
              sx={{ 
                border: '1px solid #E2E8F0',
                bgcolor: parsed.fontStyle?.includes('Italic') ? '#E3F2FD' : 'transparent'
              }}
            >
              <FormatItalic />
            </IconButton>
          </Box>
        </Stack>
      ) : inputType === 'select' ? (
        <FormControl fullWidth size="small">
          <Select
            value={parsed.value || ''}
            onChange={(e) => updateRuleValue(null, null, e.target.value)}
            disabled={!rule.enabled}
          >
            {getSelectOptions(parsed.key).map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : inputType === 'number' ? (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            value={parsed.number || ''}
            onChange={(e) => updateRuleValue(e.target.value, parsed.unit, null)}
            disabled={!rule.enabled}
            sx={{ flex: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={parsed.unit || ''}
              onChange={(e) => updateRuleValue(parsed.number, e.target.value, null)}
              disabled={!rule.enabled}
            >
              {getUnitOptions().map(unit => (
                <MenuItem key={unit} value={unit}>{unit || 'none'}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ) : (
        <TextField
          fullWidth
          size="small"
          value={parsed.value || ''}
          onChange={(e) => updateRuleValue(null, null, e.target.value)}
          disabled={!rule.enabled}
        />
      )}
    </Box>
  );
}
