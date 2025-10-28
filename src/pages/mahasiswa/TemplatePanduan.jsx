import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Paper, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip, Card, CardContent } from '@mui/material';
import { VisibilityOutlined, DescriptionOutlined, DownloadOutlined } from '@mui/icons-material';
import { useHeader } from '../../context/HeaderContext';
import { renderAsync } from 'docx-preview';

export default function TemplatePanduan() {
  const { setHeaderInfo } = useHeader();
  const [templates] = useState([
    { 
      id: 1, 
      name: 'Panduan_TA_2024.docx', 
      version: '2025.1', 
      rules: 24, 
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
      rules: 24, 
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
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const previewContainerRef = useRef(null);

  useEffect(() => {
    setHeaderInfo({ title: 'Template & Panduan' });
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo]);

  const activeTemplate = templates.find(t => t.isActive);

  return (
    <>
      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Template Buku
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            border: '2px solid #10B981',
            borderRadius: '12px',
            bgcolor: '#ECFDF5',
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '8px',
              bgcolor: '#D1FAE5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <DescriptionOutlined sx={{ color: '#10B981', fontSize: 28 }} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body1" fontWeight="600">
              {activeTemplate?.name}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
            <IconButton
              size="small"
              onClick={() => {
                setPreviewTemplate(activeTemplate);
                setPreviewDialog(true);
                setPreviewLoading(true);
                setPreviewError(null);
              }}
            >
              <VisibilityOutlined />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                const link = document.createElement('a');
                link.href = activeTemplate?.fileUrl;
                link.download = activeTemplate?.name;
                link.click();
              }}
            >
              <DownloadOutlined />
            </IconButton>
          </Stack>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0', mt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Panduan Format Buku
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Versi: <strong>{activeTemplate?.name}</strong>
          </Typography>
        </Box>

        <Stack spacing={4}>
          <Box>
            <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>Page Settings</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'stretch' }}>
              {activeTemplate?.formatRules.page_settings.map((setting) => (
                <Box key={setting.id} sx={{ flex: '0 0 calc(33.333% - 11px)', display: 'flex' }}>
                  <Card sx={{ 
                    width: '100%',
                    border: '1px solid #E2E8F0', 
                    boxShadow: 'none', 
                    display: 'flex', 
                    flexDirection: 'column' 
                  }}>
                    <CardContent sx={{ flex: 1, overflow: 'auto' }}>
                      <Typography variant="body1" fontWeight="600" sx={{ mb: 2 }}>
                        {setting.description}
                      </Typography>
                      <Stack spacing={0.5}>
                        {setting.rules.filter(rule => rule.enabled).map((rule, idx) => (
                          <Typography key={idx} variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            • {rule.value}
                          </Typography>
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
              {activeTemplate?.formatRules.components.map((component) => (
                <Box key={component.id} sx={{ flex: '0 0 calc(33.333% - 11px)', display: 'flex' }}>
                  <Card sx={{ width: '100%', border: '1px solid #E2E8F0', boxShadow: 'none', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: 1, overflow: 'auto' }}>
                      <Typography variant="body1" fontWeight="600" sx={{ mb: 2 }}>
                        {component.name}
                      </Typography>
                      <Stack spacing={0.5}>
                        {component.rules.filter(rule => rule.enabled).map((rule, idx) => (
                          <Typography key={idx} variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            • {rule.value}
                          </Typography>
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
