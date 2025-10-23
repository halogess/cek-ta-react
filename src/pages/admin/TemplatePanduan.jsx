import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip, TextField, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { UploadFileOutlined, SaveOutlined, CloseOutlined, VisibilityOutlined, DeleteOutlined, DescriptionOutlined, EditOutlined, ExpandMore } from '@mui/icons-material';
import { useHeader } from '../../context/HeaderContext';
import FileUploadArea from '../../components/shared/ui/FileUploadArea';
import NotificationSnackbar from '../../components/shared/ui/NotificationSnackbar';

export default function TemplatePanduan() {
  const { setHeaderInfo } = useHeader();
  const [file, setFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [extractedRules, setExtractedRules] = useState([]);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [templates, setTemplates] = useState([
    { 
      id: 1, 
      name: 'Panduan_TA_2024.docx', 
      version: '2025.1', 
      rules: 24, 
      date: '2024-01-15', 
      isActive: true,
      formatRules: {
        page_settings: [
          { id: 'a4_portrait', description: 'A4 Portrait (Dokumen Utama)', rules: ['Paper Size: A4', 'Orientation: Portrait', 'Margin Top: 4cm', 'Margin Left: 4cm', 'Margin Bottom: 3cm', 'Margin Right: 3cm'] },
          { id: 'a4_landscape', description: 'A4 Landscape (Lampiran)', rules: ['Paper Size: A4', 'Orientation: Landscape', 'Margin Top: 4cm', 'Margin Left: 3cm', 'Margin Bottom: 3cm', 'Margin Right: 4cm'] },
          { id: 'a3_landscape', description: 'A3 Landscape (Lampiran Khusus)', rules: ['Paper Size: A3', 'Orientation: Landscape', 'Margin Top: 4cm', 'Margin Left: 4cm', 'Margin Bottom: 3cm', 'Margin Right: 3cm'] }
        ],
        components: [
          { id: 'judul_bab', name: 'Judul Bab', rules: ['Font: Times New Roman, 16pt, Bold', 'Case: Uppercase', 'Alignment: Center', 'Line Spacing: 1.5', 'Numbering: BAB [ROMAN]'] },
          { id: 'sub_judul', name: 'Sub Judul', rules: ['Font: Times New Roman, 14pt, Bold', 'Case: Capitalize Each Word', 'Alignment: Left', 'Line Spacing: 1.5', 'Indent Hanging: 1.27cm'] },
          { id: 'paragraf', name: 'Paragraf', rules: ['Font: Times New Roman, 12pt', 'Alignment: Justify', 'Line Spacing: 1.5', 'First Line Indent: 1.27cm'] },
          { id: 'kutipan', name: 'Kutipan', rules: ['Font: Times New Roman, 12pt', 'Alignment: Justify', 'Line Spacing: 1.0', 'Indent Left/Right: 1.27cm'] },
          { id: 'gambar', name: 'Gambar', rules: ['Layout: In Line With Text', 'Alignment: Center', 'Line Spacing: 1.0', 'Not Full Page'] },
          { id: 'caption_gambar', name: 'Caption Gambar', rules: ['Font: Times New Roman, 12pt, Bold', 'Alignment: Center', 'Position: Below Image', 'Numbering: Gambar [BAB].[NOMOR]'] },
          { id: 'tabel', name: 'Tabel', rules: ['Alignment: Center', 'Not Full Page', 'Has Repeating Header'] },
          { id: 'caption_tabel', name: 'Caption Tabel', rules: ['Font: Times New Roman, 12pt, Bold', 'Alignment: Center', 'Position: Above Table', 'Numbering: Tabel [BAB].[NOMOR]'] },
          { id: 'blok_kode', name: 'Blok Kode', rules: ['Font: Courier New, 10pt', 'Alignment: Left', 'Line Spacing: 1.0', 'Indent Left: 1cm'] },
          { id: 'rumus', name: 'Rumus', rules: ['Font: Cambria Math, 12pt', 'Alignment: Justify', 'Line Spacing: 1.5', 'Numbering: ([BAB].[NOMOR])'] },
          { id: 'footnote', name: 'Footnote', rules: ['Font: Times New Roman, 10pt', 'Alignment: Left', 'Line Spacing: 1.0', 'Continuous Numbering'] },
          { id: 'daftar_pustaka', name: 'Daftar Pustaka', rules: ['Font: Times New Roman, 12pt', 'Alignment: Justify', 'Line Spacing: 1.0', 'Alphabetized'] },
          { id: 'nomor_halaman', name: 'Nomor Halaman', rules: ['Font: Times New Roman, 12pt', 'Line Spacing: 1.0', 'Page Number Field'] }
        ]
      }
    },
    { 
      id: 2, 
      name: 'Panduan_TA_2023.docx', 
      version: '2024.1', 
      rules: 22, 
      date: '2023-09-01', 
      isActive: false,
      formatRules: {
        page_settings: [
          { id: 'a4_portrait', description: 'A4 Portrait (Dokumen Utama)', rules: ['Paper Size: A4', 'Orientation: Portrait', 'Margin Top: 3cm', 'Margin Left: 3cm', 'Margin Bottom: 2.5cm', 'Margin Right: 2.5cm'] }
        ],
        components: [
          { id: 'judul_bab', name: 'Judul Bab', rules: ['Font: Times New Roman, 14pt, Bold', 'Case: Uppercase', 'Alignment: Center'] },
          { id: 'paragraf', name: 'Paragraf', rules: ['Font: Times New Roman, 12pt', 'Alignment: Justify', 'Line Spacing: 1.15'] }
        ]
      }
    },
  ]);
  const [editDialog, setEditDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newName, setNewName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [editRuleDialog, setEditRuleDialog] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [editedRuleValue, setEditedRuleValue] = useState('');

  useEffect(() => {
    setHeaderInfo({ title: 'Template Panduan' });
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleUpload = () => {
    const rules = [
      { name: 'Font', value: 'Times New Roman, 12pt' },
      { name: 'Spasi Baris', value: '1.5' },
      { name: 'Margin Kiri', value: '4 cm' },
      { name: 'Margin Kanan', value: '3 cm' },
      { name: 'Margin Atas', value: '4 cm' },
      { name: 'Margin Bawah', value: '3 cm' },
      { name: 'Indentasi Paragraf', value: '1.27 cm' },
      { name: 'Spasi Sebelum Paragraf', value: '0 pt' },
      { name: 'Spasi Setelah Paragraf', value: '0 pt' },
      { name: 'Alignment', value: 'Justify' },
    ];
    setExtractedRules(rules);
    setUploadSuccess(true);
    setUploadDialog(false);
  };

  const handleSave = () => {
    console.log('Simpan aturan:', extractedRules);
    setUploadSuccess(false);
    setFile(null);
    setExtractedRules([]);
    setShowSaveSuccess(true);
  };

  const handleCancel = () => {
    setUploadSuccess(false);
    setExtractedRules([]);
  };

  const handleActivate = (id) => {
    setTemplates(templates.map(t => ({ ...t, isActive: t.id === id })));
  };

  const handleDelete = (id) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const handleEditName = (template) => {
    setEditingTemplate(template);
    setNewName(template.name.replace('.docx', ''));
    setEditDialog(true);
  };

  const handleSaveName = () => {
    setTemplates(templates.map(t => 
      t.id === editingTemplate.id ? { ...t, name: newName + '.docx' } : t
    ));
    setEditDialog(false);
  };

  const handleEditRule = (type, parentId, ruleIndex, ruleValue) => {
    setEditingRule({ type, parentId, ruleIndex });
    setEditedRuleValue(ruleValue);
    setEditRuleDialog(true);
  };

  const handleSaveRule = () => {
    const newTemplates = templates.map(t => {
      if (t.id === selectedTemplateId) {
        if (editingRule.type === 'page_settings') {
          return {
            ...t,
            formatRules: {
              ...t.formatRules,
              page_settings: t.formatRules.page_settings.map(s => 
                s.id === editingRule.parentId 
                  ? { ...s, rules: s.rules.map((r, i) => i === editingRule.ruleIndex ? editedRuleValue : r) }
                  : s
              )
            }
          };
        } else {
          return {
            ...t,
            formatRules: {
              ...t.formatRules,
              components: t.formatRules.components.map(c => 
                c.id === editingRule.parentId 
                  ? { ...c, rules: c.rules.map((r, i) => i === editingRule.ruleIndex ? editedRuleValue : r) }
                  : c
              )
            }
          };
        }
      }
      return t;
    });
    setTemplates(newTemplates);
    setEditRuleDialog(false);
  };

  return (
    <>
      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Daftar Template
            </Typography>
            <Typography color="text.secondary">
              Template panduan yang tersedia dalam sistem
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<UploadFileOutlined />}
            onClick={() => setUploadDialog(true)}
          >
            Upload Template
          </Button>
        </Box>

      <Dialog
        open={uploadSuccess}
        onClose={handleCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            Aturan Format yang Diekstrak
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Berikut adalah aturan format yang berhasil diekstrak dari template
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            {extractedRules.map((rule, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: '#F9FAFB',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0'
                }}
              >
                <Typography variant="body2" fontWeight="medium">
                  {rule.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {rule.value}
                </Typography>
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<CloseOutlined />}
            onClick={handleCancel}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveOutlined />}
            onClick={handleSave}
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      <NotificationSnackbar
        open={showSaveSuccess}
        onClose={() => setShowSaveSuccess(false)}
        message="Aturan format berhasil disimpan!"
      />

      <Dialog
        open={uploadDialog}
        onClose={() => setUploadDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            Unggah Template Baru
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Unggah file .docx panduan format untuk mengekstrak aturan otomatis
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FileUploadArea
              file={file}
              onFileChange={handleFileChange}
            />
            <Typography variant="body2" color="text.secondary">
              Sistem akan secara otomatis mengekstrak aturan format dari dokumen yang diunggah
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setUploadDialog(false)}>Batal</Button>
          <Button
            variant="contained"
            startIcon={<UploadFileOutlined />}
            disabled={!file}
            onClick={handleUpload}
          >
            Unggah
          </Button>
        </DialogActions>
      </Dialog>

        <Stack spacing={2}>
          {templates.map((template) => (
            <Box
              key={template.id}
              onClick={() => setSelectedTemplateId(template.id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                border: selectedTemplateId === template.id ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                borderRadius: '12px',
                bgcolor: selectedTemplateId === template.id ? '#EFF6FF' : '#FAFBFC',
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

              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="body1" fontWeight="600">
                    {template.name}
                  </Typography>
                  <IconButton size="small" onClick={() => handleEditName(template)}>
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

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<VisibilityOutlined />}
                >
                  Preview
                </Button>
                {!template.isActive && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleActivate(template.id)}
                  >
                    Aktifkan
                  </Button>
                )}
                {!template.isActive && (
                  <IconButton size="small" color="error" onClick={() => handleDelete(template.id)}>
                    <DeleteOutlined />
                  </IconButton>
                )}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Paper>

      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Nama Template</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Nama Template"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditDialog(false)}>Batal</Button>
          <Button variant="contained" onClick={handleSaveName}>Simpan</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editRuleDialog} onClose={() => setEditRuleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Aturan</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Nilai Aturan"
            value={editedRuleValue}
            onChange={(e) => setEditedRuleValue(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditRuleDialog(false)}>Batal</Button>
          <Button variant="contained" onClick={handleSaveRule}>Simpan</Button>
        </DialogActions>
      </Dialog>

      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0', mt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Panduan Format Buku
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Aturan format dari template: <strong>{templates.find(t => t.id === selectedTemplateId)?.name}</strong>
          </Typography>
        </Box>

        <Stack spacing={2}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight="600">Page Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1}>
                {templates.find(t => t.id === selectedTemplateId)?.formatRules.page_settings.map((setting) => (
                  <Accordion key={setting.id}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', mr: 2 }}>
                        <Typography variant="body2" fontWeight="600" sx={{ flex: 1 }}>
                          {setting.description}
                        </Typography>
                        <Chip 
                          label={setting.enabled !== false ? 'Aktif' : 'Nonaktif'} 
                          size="small" 
                          color={setting.enabled !== false ? 'success' : 'default'}
                          sx={{ height: 20 }}
                        />
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            const newTemplates = templates.map(t => {
                              if (t.id === selectedTemplateId) {
                                return {
                                  ...t,
                                  formatRules: {
                                    ...t.formatRules,
                                    page_settings: t.formatRules.page_settings.map(s => 
                                      s.id === setting.id ? { ...s, enabled: s.enabled === false } : s
                                    )
                                  }
                                };
                              }
                              return t;
                            });
                            setTemplates(newTemplates);
                          }}
                        >
                          <EditOutlined sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={0.5}>
                        {setting.rules.map((rule, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                              • {rule}
                            </Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditRule('page_settings', setting.id, idx, rule)}
                            >
                              <EditOutlined sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                        ))}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight="600">Components</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1}>
                {templates.find(t => t.id === selectedTemplateId)?.formatRules.components.map((component) => (
                  <Accordion key={component.id}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', mr: 2 }}>
                        <Typography variant="body2" fontWeight="600" sx={{ flex: 1 }}>
                          {component.name}
                        </Typography>
                        <Chip 
                          label={component.enabled !== false ? 'Aktif' : 'Nonaktif'} 
                          size="small" 
                          color={component.enabled !== false ? 'success' : 'default'}
                          sx={{ height: 20 }}
                        />
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            const newTemplates = templates.map(t => {
                              if (t.id === selectedTemplateId) {
                                return {
                                  ...t,
                                  formatRules: {
                                    ...t.formatRules,
                                    components: t.formatRules.components.map(c => 
                                      c.id === component.id ? { ...c, enabled: c.enabled === false } : c
                                    )
                                  }
                                };
                              }
                              return t;
                            });
                            setTemplates(newTemplates);
                          }}
                        >
                          <EditOutlined sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={0.5}>
                        {component.rules.map((rule, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                              • {rule}
                            </Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditRule('components', component.id, idx, rule)}
                            >
                              <EditOutlined sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                        ))}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Paper>
    </>
  );
}
