/**
 * Utility untuk parsing rule value dari template
 * Memecah string rule menjadi komponen-komponen yang bisa diedit
 * 
 * Contoh input:
 * - "Font: Times New Roman, 12pt, Bold" -> { key, fontName, fontSize, fontStyle }
 * - "Margin Top: 4cm" -> { key, number, unit }
 * - "Alignment: Center" -> { key, value }
 */
export const parseRuleValue = (value) => {
  // Cari posisi colon untuk memisahkan key dan value
  const colonIndex = value.indexOf(':');
  if (colonIndex === -1) return { key: '', value: value };
  
  // Pisahkan key dan value
  const key = value.substring(0, colonIndex).trim();
  const val = value.substring(colonIndex + 1).trim();
  
  // Parsing khusus untuk Font (format: "Font Name, Size, Style")
  if (key.toLowerCase() === 'font') {
    const parts = val.split(',').map(p => p.trim());
    const fontName = parts[0] || '';
    const size = parts[1] || '';
    const styles = parts.slice(2).join(', ');
    return { key, fontName, fontSize: size, fontStyle: styles };
  }
  
  // Parsing untuk nilai numerik dengan unit (contoh: "4cm", "1.5", "12pt")
  const numMatch = val.match(/^([\d.]+)\s*([a-z%]+)?$/i);
  if (numMatch) {
    return { key, number: numMatch[1], unit: numMatch[2] || '' };
  }
  
  // Default: return sebagai string value
  return { key, value: val };
};
