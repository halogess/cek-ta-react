import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Paper, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip, TextField, Accordion, AccordionSummary, AccordionDetails, Select, MenuItem, FormControl, InputLabel, Grid, Card, CardContent } from '@mui/material';
import { UploadFileOutlined, SaveOutlined, CloseOutlined, VisibilityOutlined, DeleteOutlined, DescriptionOutlined, EditOutlined, ExpandMore, FormatBold, FormatItalic, FormatAlignLeft, FormatAlignCenter, FormatAlignRight, FormatAlignJustify, DownloadOutlined } from '@mui/icons-material';
import { useHeader } from '../../context/HeaderContext';
import FileUploadArea from '../../components/shared/ui/FileUploadArea';
import NotificationSnackbar from '../../components/shared/ui/NotificationSnackbar';
import { renderAsync } from 'docx-preview';

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
      rules: 70, 
      date: '2024-01-15', 
      isActive: true,
      fileUrl: '/templates/[TEMPLATE] BUKU TA - TESIS.docx',
      formatRules: {
        page_settings: [
          { id: 'a4_portrait', description: 'A4 Portrait (Dokumen Utama)', rules: [
            { value: 'Paper Size: A4', enabled: true },
            { value: 'Orientation: Portrait', enabled: true },
            { value: 'Margin Top: 4cm', enabled: true },
            { value: 'Margin Left: 4cm', enabled: true },
            { value: 'Margin Bottom: 3cm', enabled: true },
            { value: 'Margin Right: 3cm', enabled: true }
          ]},
          { id: 'a4_landscape', description: 'A4 Landscape (Lampiran)', rules: [
            { value: 'Paper Size: A4', enabled: true },
            { value: 'Orientation: Landscape', enabled: true },
            { value: 'Margin Top: 4cm', enabled: true },
            { value: 'Margin Left: 3cm', enabled: true },
            { value: 'Margin Bottom: 3cm', enabled: true },
            { value: 'Margin Right: 4cm', enabled: true }
          ]},
          { id: 'a3_landscape', description: 'A3 Landscape (Lampiran Khusus)', rules: [
            { value: 'Paper Size: A3', enabled: true },
            { value: 'Orientation: Landscape', enabled: true },
            { value: 'Margin Top: 4cm', enabled: true },
            { value: 'Margin Left: 4cm', enabled: true },
            { value: 'Margin Bottom: 3cm', enabled: true },
            { value: 'Margin Right: 3cm', enabled: true }
          ]}
        ],
        components: [
          { id: 'judul_bab', name: 'Judul Bab', rules: [
            { value: 'Font: Times New Roman, 16pt, Bold', enabled: true },
            { value: 'Case: Uppercase', enabled: true },
            { value: 'Alignment: Center', enabled: true },
            { value: 'Line Spacing: 1.5', enabled: true },
            { value: 'Numbering: BAB [ROMAN]', enabled: true }
          ]},
          { id: 'sub_judul', name: 'Sub Judul', rules: [
            { value: 'Font: Times New Roman, 14pt, Bold', enabled: true },
            { value: 'Case: Capitalize Each Word', enabled: true },
            { value: 'Alignment: Left', enabled: true },
            { value: 'Line Spacing: 1.5', enabled: true },
            { value: 'Indent Hanging: 1.27cm', enabled: true }
          ]},
          { id: 'paragraf', name: 'Paragraf', rules: [
            { value: 'Font: Times New Roman, 12pt', enabled: true },
            { value: 'Alignment: Justify', enabled: true },
            { value: 'Line Spacing: 1.5', enabled: true },
            { value: 'First Line Indent: 1.27cm', enabled: true }
          ]},
          { id: 'kutipan', name: 'Kutipan', rules: [
            { value: 'Font: Times New Roman, 12pt', enabled: true },
            { value: 'Alignment: Justify', enabled: true },
            { value: 'Line Spacing: 1.0', enabled: true },
            { value: 'Indent Left/Right: 1.27cm', enabled: true }
          ]},
          { id: 'gambar', name: 'Gambar', rules: [
            { value: 'Layout: In Line With Text', enabled: true },
            { value: 'Alignment: Center', enabled: true },
            { value: 'Line Spacing: 1.0', enabled: true },
            { value: 'Not Full Page', enabled: true }
          ]},
          { id: 'caption_gambar', name: 'Caption Gambar', rules: [
            { value: 'Font: Times New Roman, 12pt, Bold', enabled: true },
            { value: 'Alignment: Center', enabled: true },
            { value: 'Position: Below Image', enabled: true },
            { value: 'Numbering: Gambar [BAB].[NOMOR]', enabled: true }
          ]},
          { id: 'tabel', name: 'Tabel', rules: [
            { value: 'Alignment: Center', enabled: true },
            { value: 'Not Full Page', enabled: true },
            { value: 'Has Repeating Header', enabled: true }
          ]},
          { id: 'caption_tabel', name: 'Caption Tabel', rules: [
            { value: 'Font: Times New Roman, 12pt, Bold', enabled: true },
            { value: 'Alignment: Center', enabled: true },
            { value: 'Position: Above Table', enabled: true },
            { value: 'Numbering: Tabel [BAB].[NOMOR]', enabled: true }
          ]},
          { id: 'blok_kode', name: 'Blok Kode', rules: [
            { value: 'Font: Courier New, 10pt', enabled: true },
            { value: 'Alignment: Left', enabled: true },
            { value: 'Line Spacing: 1.0', enabled: true },
            { value: 'Indent Left: 1cm', enabled: true }
          ]},
          { id: 'rumus', name: 'Rumus', rules: [
            { value: 'Font: Cambria Math, 12pt', enabled: true },
            { value: 'Alignment: Justify', enabled: true },
            { value: 'Line Spacing: 1.5', enabled: true },
            { value: 'Numbering: ([BAB].[NOMOR])', enabled: true }
          ]},
          { id: 'footnote', name: 'Footnote', rules: [
            { value: 'Font: Times New Roman, 10pt', enabled: true },
            { value: 'Alignment: Left', enabled: true },
            { value: 'Line Spacing: 1.0', enabled: true },
            { value: 'Continuous Numbering', enabled: true }
          ]},
          { id: 'daftar_pustaka', name: 'Daftar Pustaka', rules: [
            { value: 'Font: Times New Roman, 12pt', enabled: true },
            { value: 'Alignment: Justify', enabled: true },
            { value: 'Line Spacing: 1.0', enabled: true },
            { value: 'Alphabetized', enabled: true }
          ]},
          { id: 'nomor_halaman', name: 'Nomor Halaman', rules: [
            { value: 'Font: Times New Roman, 12pt', enabled: true },
            { value: 'Line Spacing: 1.0', enabled: true },
            { value: 'Page Number Field', enabled: true }
          ]}
        ]
      }
    },
    { 
      id: 2, 
      name: 'Panduan_TA_2023.docx', 
      version: '2024.1', 
      rules: 70, 
      date: '2023-09-01', 
      isActive: false,
      fileUrl: '/templates/[TEMPLATE] BUKU TA - TESIS.docx',
      formatRules: {
        page_settings: [
          { id: 'a4_portrait', description: 'A4 Portrait (Dokumen Utama)', rules: [
            { value: 'Paper Size: A4', enabled: true },
            { value: 'Orientation: Portrait', enabled: true },
            { value: 'Margin Top: 3cm', enabled: true },
            { value: 'Margin Left: 3cm', enabled: true },
            { value: 'Margin Bottom: 2.5cm', enabled: true },
            { value: 'Margin Right: 2.5cm', enabled: true }
          ]},
          { id: 'a4_landscape', description: 'A4 Landscape (Lampiran)', rules: [
            { value: 'Paper Size: A4', enabled: true },
            { value: 'Orientation: Landscape', enabled: true },
            { value: 'Margin Top: 3cm', enabled: true },
            { value: 'Margin Left: 2.5cm', enabled: true },
            { value: 'Margin Bottom: 2.5cm', enabled: true },
            { value: 'Margin Right: 3cm', enabled: true }
          ]},
          { id: 'a3_landscape', description: 'A3 Landscape (Lampiran Khusus)', rules: [
            { value: 'Paper Size: A3', enabled: true },
            { value: 'Orientation: Landscape', enabled: true },
            { value: 'Margin Top: 3cm', enabled: true },
            { value: 'Margin Left: 3cm', enabled: true },
            { value: 'Margin Bottom: 2.5cm', enabled: true },
            { value: 'Margin Right: 2.5cm', enabled: true }
          ]}
        ],
        components: [
          { id: 'judul_bab', name: 'Judul Bab', rules: [
            { value: 'Font: Times New Roman, 14pt, Bold', enabled: true },
            { value: 'Case: Uppercase', enabled: true },
            { value: 'Alignment: Center', enabled: true },
            { value: 'Line Spacing: 1.5', enabled: true },
            { value: 'Numbering: BAB [ROMAN]', enabled: true }
          ]},
          { id: 'sub_judul', name: 'Sub Judul', rules: [
            { value: 'Font: Times New Roman, 12pt, Bold', enabled: true },
            { value: 'Case: Capitalize Each Word', enabled: true },
            { value: 'Alignment: Left', enabled: true },
            { value: 'Line Spacing: 1.5', enabled: true },
            { value: 'Indent Hanging: 1.27cm', enabled: true }
          ]},
          { id: 'paragraf', name: 'Paragraf', rules: [
            { value: 'Font: Times New Roman, 12pt', enabled: true },
            { value: 'Alignment: Justify', enabled: true },
            { value: 'Line Spacing: 1.15', enabled: true },
            { value: 'First Line Indent: 1.27cm', enabled: true }
          ]},
          { id: 'kutipan', name: 'Kutipan', rules: [
            { value: 'Font: Times New Roman, 12pt', enabled: true },
            { value: 'Alignment: Justify', enabled: true },
            { value: 'Line Spacing: 1.0', enabled: true },
            { value: 'Indent Left/Right: 1.27cm', enabled: true }
          ]},
          { id: 'gambar', name: 'Gambar', rules: [
            { value: 'Layout: In Line With Text', enabled: true },
            { value: 'Alignment: Center', enabled: true },
            { value: 'Line Spacing: 1.0', enabled: true },
            { value: 'Not Full Page', enabled: true }
          ]},
          { id: 'caption_gambar', name: 'Caption Gambar', rules: [
            { value: 'Font: Times New Roman, 12pt, Bold', enabled: true },
            { value: 'Alignment: Center', enabled: true },
            { value: 'Position: Below Image', enabled: true },
            { value: 'Numbering: Gambar [BAB].[NOMOR]', enabled: true }
          ]},
          { id: 'tabel', name: 'Tabel', rules: [
            { value: 'Alignment: Center', enabled: true },
            { value: 'Not Full Page', enabled: true },
            { value: 'Has Repeating Header', enabled: true }
          ]},
          { id: 'caption_tabel', name: 'Caption Tabel', rules: [
            { value: 'Font: Times New Roman, 12pt, Bold', enabled: true },
            { value: 'Alignment: Center', enabled: true },
            { value: 'Position: Above Table', enabled: true },
            { value: 'Numbering: Tabel [BAB].[NOMOR]', enabled: true }
          ]},
          { id: 'blok_kode', name: 'Blok Kode', rules: [
            { value: 'Font: Courier New, 10pt', enabled: true },
            { value: 'Alignment: Left', enabled: true },
            { value: 'Line Spacing: 1.0', enabled: true },
            { value: 'Indent Left: 1cm', enabled: true }
          ]},
          { id: 'rumus', name: 'Rumus', rules: [
            { value: 'Font: Cambria Math, 12pt', enabled: true },
            { value: 'Alignment: Justify', enabled: true },
            { value: 'Line Spacing: 1.5', enabled: true },
            { value: 'Numbering: ([BAB].[NOMOR])', enabled: true }
          ]},
          { id: 'footnote', name: 'Footnote', rules: [
            { value: 'Font: Times New Roman, 10pt', enabled: true },
            { value: 'Alignment: Left', enabled: true },
            { value: 'Line Spacing: 1.0', enabled: true },
            { value: 'Continuous Numbering', enabled: true }
          ]},
          { id: 'daftar_pustaka', name: 'Daftar Pustaka', rules: [
            { value: 'Font: Times New Roman, 12pt', enabled: true },
            { value: 'Alignment: Justify', enabled: true },
            { value: 'Line Spacing: 1.0', enabled: true },
            { value: 'Alphabetized', enabled: true }
          ]},
          { id: 'nomor_halaman', name: 'Nomor Halaman', rules: [
            { value: 'Font: Times New Roman, 12pt', enabled: true },
            { value: 'Line Spacing: 1.0', enabled: true },
            { value: 'Page Number Field', enabled: true }
          ]}
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
  const [hasChanges, setHasChanges] = useState(false);
  const [saveConfirmDialog, setSaveConfirmDialog] = useState(false);
  const [originalTemplates, setOriginalTemplates] = useState([]);
  const [localRules, setLocalRules] = useState([]);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const previewContainerRef = useRef(null);

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
    const template = templates.find(t => t.id === selectedTemplateId);
    const rules = type === 'page_settings'
      ? template?.formatRules.page_settings.find(s => s.id === parentId)?.rules
      : template?.formatRules.components.find(c => c.id === parentId)?.rules;
    
    setLocalRules(rules || []);
    setEditingRule({ type, parentId, ruleIndex });
    setEditRuleDialog(true);
  };

  const handleToggleRule = (type, parentId, ruleIndex) => {
    if (!hasChanges) {
      setOriginalTemplates(JSON.parse(JSON.stringify(templates)));
    }
    const newTemplates = templates.map(t => {
      if (t.id === selectedTemplateId) {
        if (type === 'page_settings') {
          return {
            ...t,
            formatRules: {
              ...t.formatRules,
              page_settings: t.formatRules.page_settings.map(s => 
                s.id === parentId 
                  ? { ...s, rules: s.rules.map((r, i) => i === ruleIndex ? { ...r, enabled: !r.enabled } : r) }
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
                c.id === parentId 
                  ? { ...c, rules: c.rules.map((r, i) => i === ruleIndex ? { ...r, enabled: !r.enabled } : r) }
                  : c
              )
            }
          };
        }
      }
      return t;
    });
    setTemplates(newTemplates);
    setHasChanges(true);
  };

  const handleSaveComponentRules = (updatedRules) => {
    if (!hasChanges) {
      setOriginalTemplates(JSON.parse(JSON.stringify(templates)));
    }
    
    const newTemplates = templates.map(t => {
      if (t.id === selectedTemplateId) {
        if (editingRule.type === 'page_settings') {
          return {
            ...t,
            formatRules: {
              ...t.formatRules,
              page_settings: t.formatRules.page_settings.map(s => 
                s.id === editingRule.parentId ? { ...s, rules: updatedRules } : s
              )
            }
          };
        } else {
          return {
            ...t,
            formatRules: {
              ...t.formatRules,
              components: t.formatRules.components.map(c => 
                c.id === editingRule.parentId ? { ...c, rules: updatedRules } : c
              )
            }
          };
        }
      }
      return t;
    });
    setTemplates(newTemplates);
    setEditRuleDialog(false);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    setSaveConfirmDialog(false);
    setHasChanges(false);
    setShowSaveSuccess(true);
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

              <Box sx={{ flex: 1, minWidth: 0 }}>
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

              <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0, minWidth: '280px', justifyContent: 'flex-end' }}>
                {!template.isActive && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleActivate(template.id)}
                  >
                    Aktifkan
                  </Button>
                )}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplate(template);
                    setPreviewDialog(true);
                    setPreviewLoading(true);
                    setPreviewError(null);
                  }}
                >
                  <VisibilityOutlined />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    const link = document.createElement('a');
                    link.href = template.fileUrl;
                    link.download = template.name;
                    link.click();
                  }}
                >
                  <DownloadOutlined />
                </IconButton>
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

      <Dialog open={editRuleDialog} onClose={() => setEditRuleDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Aturan Komponen</DialogTitle>
        <DialogContent>
          {editingRule && (() => {
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
            
            const updateRuleValue = (index, newNumber, newUnit, newValue, fontName, fontSize, fontStyle) => {
              const rule = localRules[index];
              const parsed = parseValue(rule.value);
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
              
              const newRules = [...localRules];
              newRules[index] = { ...rule, value: updatedValue };
              setLocalRules(newRules);
            };
            
            return (
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {localRules.map((rule, idx) => {
                  const parsed = parseValue(rule.value);
                  const inputType = getInputType(parsed.key);
                  
                  return (
                    <Box key={idx} sx={{ flex: '0 0 calc(50% - 8px)', p: 1.5, border: '1px solid #E2E8F0', borderRadius: '6px', bgcolor: rule.enabled ? '#fff' : '#F9FAFB' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight="600">{parsed.key}</Typography>
                        <Chip 
                          label={rule.enabled ? 'Aktif' : 'Nonaktif'} 
                          size="small" 
                          color={rule.enabled ? 'success' : 'default'}
                          onClick={() => {
                            const newRules = [...localRules];
                            newRules[idx] = { ...newRules[idx], enabled: !newRules[idx].enabled };
                            setLocalRules(newRules);
                          }}
                          sx={{ cursor: 'pointer' }}
                        />
                      </Box>
                      
                      {parsed.key.toLowerCase().includes('alignment') ? (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {['Left', 'Center', 'Right', 'Justify'].map(align => (
                            <IconButton
                              key={align}
                              size="small"
                              onClick={() => updateRuleValue(idx, null, null, align)}
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
                                onChange={(e) => updateRuleValue(idx, null, null, null, e.target.value, parsed.fontSize, parsed.fontStyle)}
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
                                onChange={(e) => updateRuleValue(idx, null, null, null, parsed.fontName, e.target.value, parsed.fontStyle)}
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
                                updateRuleValue(idx, null, null, null, parsed.fontName, parsed.fontSize, newStyles.join(', '));
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
                                updateRuleValue(idx, null, null, null, parsed.fontName, parsed.fontSize, newStyles.join(', '));
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
                            onChange={(e) => updateRuleValue(idx, null, null, e.target.value)}
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
                            onChange={(e) => updateRuleValue(idx, e.target.value, parsed.unit, null)}
                            disabled={!rule.enabled}
                            sx={{ flex: 1 }}
                          />
                          <FormControl size="small" sx={{ minWidth: 80 }}>
                            <Select
                              value={parsed.unit || ''}
                              onChange={(e) => updateRuleValue(idx, parsed.number, e.target.value, null)}
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
                          onChange={(e) => updateRuleValue(idx, null, null, e.target.value)}
                          disabled={!rule.enabled}
                        />
                      )}
                    </Box>
                  );
                })}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 2, mt: 2 }}>
                  <Button onClick={() => setEditRuleDialog(false)}>Batal</Button>
                  <Button variant="contained" onClick={() => handleSaveComponentRules(localRules)}>Simpan</Button>
                </Box>
              </Box>
            );
          })()}
        </DialogContent>
      </Dialog>

      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0', mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Panduan Format Buku
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              Aturan format dari template: <strong>{templates.find(t => t.id === selectedTemplateId)?.name}</strong>
            </Typography>
            <Typography color="text.secondary">
              {(() => {
                const template = templates.find(t => t.id === selectedTemplateId);
                if (!template) return '';
                const allRules = [
                  ...template.formatRules.page_settings.flatMap(s => s.rules),
                  ...template.formatRules.components.flatMap(c => c.rules)
                ];
                const activeRules = allRules.filter(r => r.enabled).length;
                const totalRules = allRules.length;
                return `${activeRules} / ${totalRules} aturan diaktifkan`;
              })()}
            </Typography>
          </Box>
          {hasChanges && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<CloseOutlined />}
                onClick={() => {
                  setTemplates(originalTemplates);
                  setHasChanges(false);
                }}
              >
                Batalkan
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveOutlined />}
                onClick={() => setSaveConfirmDialog(true)}
              >
                Simpan Perubahan
              </Button>
            </Stack>
          )}
        </Box>

        <Stack spacing={4}>
          <Box>
            <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>Page Settings</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'stretch' }}>
              {templates.find(t => t.id === selectedTemplateId)?.formatRules.page_settings.map((setting) => (
                <Box key={setting.id} sx={{ flex: '0 0 calc(33.333% - 11px)', display: 'flex' }}>
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
                          {setting.description}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditRule('page_settings', setting.id, 0, '')}
                        >
                          <EditOutlined sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                      <Stack spacing={0.5}>
                        {setting.rules.map((rule, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ flex: 1, textDecoration: rule.enabled ? 'none' : 'line-through', opacity: rule.enabled ? 1 : 0.5, fontSize: '0.8rem' }}>
                              • {rule.value}
                            </Typography>
                            <Chip 
                              label={rule.enabled ? 'Aktif' : 'Nonaktif'} 
                              size="small" 
                              color={rule.enabled ? 'success' : 'default'}
                              onClick={() => handleToggleRule('page_settings', setting.id, idx)}
                              sx={{ height: 18, fontSize: '0.7rem', cursor: 'pointer' }}
                            />
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>Components</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'stretch' }}>
              {templates.find(t => t.id === selectedTemplateId)?.formatRules.components.map((component) => (
                <Box key={component.id} sx={{ flex: '0 0 calc(33.333% - 11px)', display: 'flex' }}>
                  <Card sx={{ width: '100%', border: '1px solid #E2E8F0', boxShadow: 'none', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: 1, overflow: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1" fontWeight="600">
                          {component.name}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditRule('components', component.id, 0, '')}
                        >
                          <EditOutlined sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                      <Stack spacing={0.5}>
                        {component.rules.map((rule, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ flex: 1, textDecoration: rule.enabled ? 'none' : 'line-through', opacity: rule.enabled ? 1 : 0.5, fontSize: '0.8rem' }}>
                              • {rule.value}
                            </Typography>
                            <Chip 
                              label={rule.enabled ? 'Aktif' : 'Nonaktif'} 
                              size="small" 
                              color={rule.enabled ? 'success' : 'default'}
                              onClick={() => handleToggleRule('components', component.id, idx)}
                              sx={{ height: 18, fontSize: '0.7rem', cursor: 'pointer' }}
                            />
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        </Stack>
      </Paper>

      <Dialog open={saveConfirmDialog} onClose={() => setSaveConfirmDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            Konfirmasi Simpan Perubahan
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2, bgcolor: '#FFF3CD', borderRadius: '8px', border: '1px solid #FFE69C', mb: 2 }}>
            <Typography variant="body2" color="#856404" fontWeight="600" gutterBottom>
              ⚠️ Peringatan
            </Typography>
            <Typography variant="body2" color="#856404">
              Perubahan yang Anda lakukan akan mengubah aturan format dari template asli. Pastikan perubahan sudah sesuai dengan kebutuhan.
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Apakah Anda yakin ingin menyimpan perubahan ini?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => {
            setSaveConfirmDialog(false);
            setHasChanges(false);
          }}>Batal</Button>
          <Button variant="contained" onClick={handleSaveChanges}>Simpan</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={previewDialog} 
        onClose={() => {
          setPreviewDialog(false);
          setPreviewError(null);
          if (previewContainerRef.current) {
            previewContainerRef.current.innerHTML = '';
          }
        }} 
        maxWidth="lg" 
        fullWidth
        TransitionProps={{
          onEntered: async () => {
            if (previewContainerRef.current && previewTemplate) {
              try {
                setPreviewLoading(true);
                const response = await fetch(previewTemplate.fileUrl);
                if (!response.ok) throw new Error('File tidak ditemukan');
                const blob = await response.blob();
                previewContainerRef.current.innerHTML = '';
                await renderAsync(blob, previewContainerRef.current);
                setPreviewLoading(false);
              } catch (error) {
                console.error('Error loading document:', error);
                setPreviewError(error.message);
                setPreviewLoading(false);
              }
            }
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            Preview Template: {previewTemplate?.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {previewLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '600px' }}>
              <Typography>Loading document...</Typography>
            </Box>
          )}
          {previewError && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '600px' }}>
              <Typography color="error">Error: {previewError}</Typography>
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
              display: previewLoading || previewError ? 'none' : 'block'
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => {
            setPreviewDialog(false);
            setPreviewError(null);
            if (previewContainerRef.current) {
              previewContainerRef.current.innerHTML = '';
            }
          }}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
