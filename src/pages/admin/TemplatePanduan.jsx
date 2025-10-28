/**
 * Admin Template Panduan Page
 * Halaman untuk mengelola template validasi:
 * - Upload/delete template
 * - Edit nama template
 * - Activate/deactivate template
 * - Edit format rules (page settings & components)
 * - Set minimum score untuk lulus
 * 
 * Fitur change tracking: simpan original state untuk cancel changes
 */

import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import { UploadFileOutlined } from '@mui/icons-material';
import { useHeader } from '../../context/HeaderContext';
import { templateService, settingsService } from '../../services';
import { parseRuleValue } from '../../utils/ruleParser';
import TemplateCard from '../../components/admin/template/TemplateCard';
import EditNameDialog from '../../components/admin/template/EditNameDialog';
import EditRuleDialog from '../../components/admin/template/EditRuleDialog';
import UploadTemplateDialog from '../../components/admin/template/UploadTemplateDialog';
import MinScoreSettings from '../../components/admin/template/MinScoreSettings';
import FormatRulesSection from '../../components/admin/template/FormatRulesSection';
import SaveConfirmDialog from '../../components/admin/template/SaveConfirmDialog';
import TemplatePreviewDialog from '../../components/admin/template/TemplatePreviewDialog';
import NotificationSnackbar from '../../components/shared/ui/NotificationSnackbar';
import Loading from '../../components/shared/ui/Loading';

export default function TemplatePanduan() {
  const { setHeaderInfo } = useHeader();
  
  // State untuk data template
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // State untuk dialogs
  const [uploadDialog, setUploadDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editRuleDialog, setEditRuleDialog] = useState(false);
  const [saveConfirmDialog, setSaveConfirmDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState(false);
  
  // State untuk edit template
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newName, setNewName] = useState('');
  
  // State untuk edit rules
  const [editingRule, setEditingRule] = useState(null);
  const [localRules, setLocalRules] = useState([]);
  
  // State untuk change tracking
  const [hasChanges, setHasChanges] = useState(false);
  const [originalTemplates, setOriginalTemplates] = useState([]);
  
  // State untuk upload
  const [file, setFile] = useState(null);
  
  // State untuk preview
  const [previewTemplate, setPreviewTemplate] = useState(null);
  
  // State untuk minimum score
  const [minScore, setMinScore] = useState(80);
  const [tempMinScore, setTempMinScore] = useState(80);
  const [scoreChanged, setScoreChanged] = useState(false);
  
  // State untuk notifications
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Set header dan fetch data saat mount
  useEffect(() => {
    setHeaderInfo({ title: 'Template Panduan' });
    fetchTemplates();
    fetchMinScore();
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo]);

  // Fetch semua template dari API
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await templateService.getAllTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch minimum score dari API
  const fetchMinScore = async () => {
    try {
      const data = await settingsService.getMinScore();
      setMinScore(data.score);
      setTempMinScore(data.score);
    } catch (error) {
      console.error('Error fetching min score:', error);
    }
  };

  // Handler untuk activate template (set sebagai template aktif)
  const handleActivate = (id) => {
    setTemplates(templates.map(t => ({ ...t, isActive: t.id === id })));
  };

  // Handler untuk delete template
  const handleDelete = (id) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  // Handler untuk buka dialog edit nama template
  const handleEditName = (template) => {
    setEditingTemplate(template);
    setNewName(template.name.replace('.docx', ''));
    setEditDialog(true);
  };

  // Handler untuk save nama template baru
  const handleSaveName = () => {
    setTemplates(templates.map(t => 
      t.id === editingTemplate.id ? { ...t, name: newName + '.docx' } : t
    ));
    setEditDialog(false);
  };

  const handleEditRule = (type, parentId) => {
    const template = templates.find(t => t.id === selectedTemplateId);
    const rules = type === 'page_settings'
      ? template?.formatRules?.page_settings?.find(s => s.id === parentId)?.rules
      : template?.formatRules?.components?.find(c => c.id === parentId)?.rules;
    
    setLocalRules(rules || []);
    setEditingRule({ type, parentId });
    setEditRuleDialog(true);
  };

  /**
   * Handler untuk toggle enable/disable rule
   * Backup original state jika ini perubahan pertama (untuk cancel)
   */
  const handleToggleRule = (type, parentId, ruleIndex) => {
    // Backup original state jika belum ada changes
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
              page_settings: t.formatRules?.page_settings?.map(s => 
                s.id === parentId 
                  ? { ...s, rules: s.rules.map((r, i) => i === ruleIndex ? { ...r, enabled: !r.enabled } : r) }
                  : s
              ) || []
            }
          };
        } else {
          return {
            ...t,
            formatRules: {
              ...t.formatRules,
              components: t.formatRules?.components?.map(c => 
                c.id === parentId 
                  ? { ...c, rules: c.rules.map((r, i) => i === ruleIndex ? { ...r, enabled: !r.enabled } : r) }
                  : c
              ) || []
            }
          };
        }
      }
      return t;
    });
    setTemplates(newTemplates);
    setHasChanges(true);
  };

  const handleUpdateRule = (index, newNumber, newUnit, newValue, fontName, fontSize, fontStyle) => {
    const rule = localRules[index];
    const parsed = parseRuleValue(rule.value);
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

  const handleToggleLocalRule = (index) => {
    const newRules = [...localRules];
    newRules[index] = { ...newRules[index], enabled: !newRules[index].enabled };
    setLocalRules(newRules);
  };

  const handleSaveComponentRules = () => {
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
              page_settings: t.formatRules?.page_settings?.map(s => 
                s.id === editingRule.parentId ? { ...s, rules: localRules } : s
              ) || []
            }
          };
        } else {
          return {
            ...t,
            formatRules: {
              ...t.formatRules,
              components: t.formatRules?.components?.map(c => 
                c.id === editingRule.parentId ? { ...c, rules: localRules } : c
              ) || []
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

  // Handler untuk save semua perubahan rules
  const handleSaveChanges = () => {
    setSaveConfirmDialog(false);
    setHasChanges(false);
    setShowSaveSuccess(true);
  };

  // Handler untuk save minimum score
  const handleSaveScore = async () => {
    try {
      await settingsService.updateMinScore(tempMinScore);
      setMinScore(tempMinScore);
      setScoreChanged(false);
      setShowSaveSuccess(true);
    } catch (error) {
      console.error('Error saving min score:', error);
    }
  };

  // Handler untuk preview template
  const handlePreview = (template) => {
    setPreviewTemplate(template);
    setPreviewDialog(true);
  };

  // Handler untuk download template file
  const handleDownload = (template) => {
    const link = document.createElement('a');
    link.href = template.fileUrl;
    link.download = template.name;
    link.click();
  };



  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  if (loading) return <Loading message="Memuat template..." />;

  return (
    <>
      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Daftar Template</Typography>
            <Typography color="text.secondary">Template panduan yang tersedia dalam sistem</Typography>
          </Box>
          <Button variant="contained" startIcon={<UploadFileOutlined />} onClick={() => setUploadDialog(true)}>
            Upload Template
          </Button>
        </Box>

        <Stack spacing={2}>
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplateId === template.id}
              onSelect={() => setSelectedTemplateId(template.id)}
              onEdit={() => handleEditName(template)}
              onPreview={() => handlePreview(template)}
              onDownload={() => handleDownload(template)}
              onDelete={() => handleDelete(template.id)}
              onActivate={() => handleActivate(template.id)}
            />
          ))}
        </Stack>
      </Paper>

      <MinScoreSettings
        minScore={minScore}
        tempMinScore={tempMinScore}
        onTempScoreChange={(value) => {
          setTempMinScore(value);
          setScoreChanged(value !== minScore);
        }}
        onSave={handleSaveScore}
        hasChanges={scoreChanged}
      />

      <FormatRulesSection
        selectedTemplate={selectedTemplate}
        hasChanges={hasChanges}
        onCancelChanges={() => {
          setTemplates(originalTemplates);
          setHasChanges(false);
        }}
        onSaveChanges={() => setSaveConfirmDialog(true)}
        onEditRule={handleEditRule}
        onToggleRule={handleToggleRule}
      />

      <EditNameDialog
        open={editDialog}
        onClose={() => setEditDialog(false)}
        name={newName}
        onNameChange={setNewName}
        onSave={handleSaveName}
      />

      <EditRuleDialog
        open={editRuleDialog}
        onClose={() => setEditRuleDialog(false)}
        rules={localRules}
        onUpdate={handleUpdateRule}
        onToggle={handleToggleLocalRule}
        onSave={handleSaveComponentRules}
      />

      <UploadTemplateDialog
        open={uploadDialog}
        onClose={() => setUploadDialog(false)}
        file={file}
        onFileChange={(e) => setFile(e.target.files?.[0])}
        onUpload={() => {
          setUploadDialog(false);
          setShowSaveSuccess(true);
        }}
      />

      <SaveConfirmDialog
        open={saveConfirmDialog}
        onClose={() => setSaveConfirmDialog(false)}
        onConfirm={handleSaveChanges}
      />

      <TemplatePreviewDialog
        open={previewDialog}
        onClose={() => setPreviewDialog(false)}
        template={previewTemplate}
      />

      <NotificationSnackbar
        open={showSaveSuccess}
        onClose={() => setShowSaveSuccess(false)}
        message="Perubahan berhasil disimpan!"
      />
    </>
  );
}
