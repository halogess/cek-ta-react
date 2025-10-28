import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Paper, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip, Card, CardContent } from '@mui/material';
import { VisibilityOutlined, DescriptionOutlined, DownloadOutlined } from '@mui/icons-material';
import { useHeader } from '../../context/HeaderContext';
import { renderAsync } from 'docx-preview';
import { templateService } from '../../services';
import Loading from '../../components/shared/ui/Loading';

export default function TemplatePanduan() {
  const { setHeaderInfo } = useHeader();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await templateService.getActiveTemplate();
      if (data) setTemplates([data]);
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) return <Loading message="Memuat template..." />;

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
              {activeTemplate?.formatRules?.page_settings?.map((setting) => (
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
              {activeTemplate?.formatRules?.components?.map((component) => (
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
