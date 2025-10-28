export const parseRuleValue = (value) => {
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
