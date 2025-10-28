import { mockUsers, getAllValidations, getValidationsByUser, getValidationById } from '../../data/mockData';
import { documentStructure, errors } from '../../data/validationData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const mockApiClient = {
  get: async (endpoint, options = {}) => {
    await delay();
    
    if (endpoint.startsWith('/validations/user/')) {
      const userId = endpoint.split('/').pop();
      return getValidationsByUser(userId);
    }
    
    if (endpoint.startsWith('/validations/') && endpoint.includes('/certificate')) {
      if (options.responseType === 'blob') {
        return new Blob(['Mock Certificate PDF'], { type: 'application/pdf' });
      }
      return { url: '/certificate.pdf' };
    }
    
    if (endpoint.startsWith('/validations/') && endpoint.includes('/errors')) {
      return errors;
    }
    
    if (endpoint.startsWith('/validations/') && endpoint.includes('/structure')) {
      return documentStructure;
    }
    
    if (endpoint.startsWith('/validations/')) {
      const id = endpoint.split('/')[2];
      return getValidationById(parseInt(id));
    }
    
    if (endpoint.startsWith('/validations')) {
      let data = getAllValidations();
      
      if (options.params) {
        const { status, prodi, startDate, endDate, search, sort } = options.params;
        
        if (status && status !== 'Semua') {
          if (status === 'Menunggu') {
            data = data.filter(v => v.status === 'Dalam Antrian' || v.status === 'Diproses');
          } else {
            data = data.filter(v => v.status === status);
          }
        }
        
        if (prodi && prodi !== 'Semua') {
          data = data.filter(v => v.jurusan === prodi);
        }
        
        if (startDate) {
          data = data.filter(v => new Date(v.date) >= new Date(startDate));
        }
        
        if (endDate) {
          data = data.filter(v => new Date(v.date) <= new Date(endDate));
        }
        
        if (search) {
          data = data.filter(v => 
            v.nama?.toLowerCase().includes(search.toLowerCase()) ||
            v.nrp?.toLowerCase().includes(search.toLowerCase()) ||
            v.filename?.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        if (sort === 'terbaru') {
          data.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sort === 'terlama') {
          data.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
      }
      
      return data;
    }
    
    if (endpoint.startsWith('/users/nrp/')) {
      const nrp = endpoint.split('/').pop();
      return mockUsers.find(u => u.nrp === nrp);
    }
    
    if (endpoint === '/settings/min-score') {
      return { score: 80 };
    }
    
    if (endpoint === '/templates/active') {
      const mockTemplate = {
        id: 1,
        name: 'Panduan_TA_2024.docx',
        version: 'v2.1.0',
        date: '15 Jan 2024',
        rules: 70,
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
            ]}
          ],
          components: [
            { id: 'judul_bab', name: 'Judul Bab', rules: [
              { value: 'Font: Times New Roman, 16pt, Bold', enabled: true },
              { value: 'Case: Uppercase', enabled: true },
              { value: 'Alignment: Center', enabled: true }
            ]}
          ]
        }
      };
      return mockTemplate;
    }
    
    if (endpoint === '/templates') {
      return [
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
        }
      ];
    }
    
    if (endpoint.startsWith('/templates/') && endpoint.includes('/download')) {
      if (options.responseType === 'blob') {
        return new Blob(['Mock Template DOCX'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      }
      return { url: '/template.docx' };
    }
    
    if (endpoint === '/dashboard/admin/stats') {
      const all = getAllValidations();
      return {
        total: all.length,
        waiting: all.filter(v => v.status === 'Dalam Antrian' || v.status === 'Diproses').length,
        passed: all.filter(v => v.status === 'Lolos').length,
        needsFix: all.filter(v => v.status === 'Tidak Lolos').length
      };
    }
    
    if (endpoint.startsWith('/dashboard/mahasiswa/')) {
      const userId = endpoint.split('/')[3];
      const userValidations = getValidationsByUser(userId);
      return {
        total: userValidations.length,
        waiting: userValidations.filter(v => v.status === 'Dalam Antrian' || v.status === 'Diproses').length,
        cancelled: userValidations.filter(v => v.status === 'Dibatalkan').length,
        passed: userValidations.filter(v => v.status === 'Lolos').length,
        needsFix: userValidations.filter(v => v.status === 'Tidak Lolos').length
      };
    }
    
    if (endpoint === '/dashboard/admin/error-stats') {
      return [
        { name: 'Format Font', count: 234, percentage: 35 },
        { name: 'Spasi Paragraf', count: 189, percentage: 28 },
        { name: 'Margin Halaman', count: 156, percentage: 23 },
        { name: 'Penomoran', count: 94, percentage: 14 }
      ];
    }
    
    if (endpoint === '/dashboard/admin/system-info') {
      return {
        todayValidations: 47,
        avgTime: 3.2,
        successRate: 71.5
      };
    }
    
    if (endpoint.startsWith('/users/')) {
      const userId = endpoint.split('/').pop();
      const user = mockUsers.find(u => u.nrp === userId);
      return user || { nrp: userId, nama: 'Mahasiswa' };
    }
    
    throw new Error('Endpoint not found');
  },

  post: async (endpoint, data) => {
    await delay();
    
    if (endpoint === '/auth/login') {
      const { nrp, password } = data;
      const role = nrp === 'admin' ? 'admin' : 'mahasiswa';
      return {
        token: 'mock-token-' + Date.now(),
        user: { nrp, role },
      };
    }
    
    if (endpoint === '/auth/logout') {
      return { message: 'Logout successful' };
    }
    
    throw new Error('Endpoint not found');
  },

  put: async (endpoint, data) => {
    await delay();
    
    if (endpoint.includes('/cancel')) {
      return { message: 'Validation cancelled' };
    }
    
    if (endpoint === '/settings/min-score') {
      return { score: data.score };
    }
    
    if (endpoint.includes('/activate')) {
      return { message: 'Template activated' };
    }
    
    if (endpoint.includes('/rules')) {
      return { message: 'Rules updated' };
    }
    
    if (endpoint.startsWith('/templates/')) {
      return { message: 'Template updated' };
    }
    
    throw new Error('Endpoint not found');
  },

  delete: async (endpoint) => {
    await delay();
    return { message: 'Deleted successfully' };
  },

  upload: async (endpoint, formData) => {
    await delay(1000);
    
    if (endpoint === '/validations/upload') {
      return {
        id: Date.now(),
        status: 'Dalam Antrian',
        message: 'Document uploaded successfully',
      };
    }
    
    if (endpoint === '/templates/upload') {
      return {
        id: Date.now(),
        name: 'Template_' + Date.now() + '.docx',
        message: 'Template uploaded successfully',
      };
    }
    
    throw new Error('Endpoint not found');
  },
};

export default mockApiClient;
