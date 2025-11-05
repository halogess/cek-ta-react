/**
 * Template Controller - Backend Logic Simulation
 * Semua logika bisnis untuk template management
 */

const mockTemplates = [
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
        ]}
      ],
      components: [
        { id: 'judul_bab', name: 'Judul Bab', rules: [
          { value: 'Font: Times New Roman, 14pt, Bold', enabled: true },
          { value: 'Case: Uppercase', enabled: true },
          { value: 'Alignment: Center', enabled: true },
          { value: 'Line Spacing: 1.5', enabled: true },
          { value: 'Numbering: BAB [ROMAN]', enabled: true }
        ]}
      ]
    }
  }
];

export const templateController = {
  /**
   * Get all templates
   */
  getAllTemplates: () => {
    return mockTemplates;
  },

  /**
   * Get active template
   */
  getActiveTemplate: () => {
    return mockTemplates.find(t => t.isActive);
  },

  /**
   * Upload template (simulate)
   */
  uploadTemplate: (formData) => {
    return {
      id: Date.now(),
      name: 'Template_' + Date.now() + '.docx',
      message: 'Template uploaded successfully',
    };
  },

  /**
   * Update template (simulate)
   */
  updateTemplate: (id, data) => {
    return { message: 'Template updated' };
  },

  /**
   * Delete template (simulate)
   */
  deleteTemplate: (id) => {
    return { message: 'Deleted successfully' };
  },

  /**
   * Activate template (simulate)
   */
  activateTemplate: (id) => {
    return { message: 'Template activated' };
  },

  /**
   * Update rules (simulate)
   */
  updateRules: (id, rules) => {
    return { message: 'Rules updated' };
  },

  /**
   * Download template (simulate)
   */
  downloadTemplate: (id) => {
    return new Blob(['Mock Template DOCX'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  },
};
