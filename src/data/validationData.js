export const documentStructure = [
  {
    chapter: 'BAB I PENDAHULUAN',
    pengantarStats: { Paragraf: 2 },
    sections: [
      { title: '1.1 Latar Belakang', stats: { Paragraf: 45, Footnote: 2, Judul: 3, 'List-item': 2, Tabel: 1, Gambar: 1, Caption: 1, Formula: 1 } },
      { title: '1.2 Rumusan Masalah', stats: { Paragraf: 12, 'List-item': 5, Judul: 2, Footnote: 1, Tabel: 1 } },
      { title: '1.3 Tujuan Penelitian', stats: { Paragraf: 8, 'List-item': 3, Judul: 1, Gambar: 1, Caption: 1 } },
      { title: '1.4 Manfaat Penelitian', stats: { Paragraf: 10, Judul: 2, 'List-item': 2, Footnote: 1 } },
    ],
    penutupStats: { Paragraf: 1 }
  },
  {
    chapter: 'BAB II TINJAUAN PUSTAKA',
    pengantarStats: { Paragraf: 5 },
    sections: [
      { title: '2.1 Landasan Teori', stats: { Paragraf: 56, Tabel: 2, Gambar: 3, Caption: 3, Formula: 5, Judul: 4, Footnote: 3, 'List-item': 4 } },
      { title: '2.2 Penelitian Terdahulu', stats: { Paragraf: 34, Tabel: 1, Footnote: 4, Judul: 3, Gambar: 2, Caption: 2, Formula: 1, 'List-item': 2 } },
      { title: '2.3 Kerangka Pemikiran', stats: { Paragraf: 20, Gambar: 1, Caption: 1, Formula: 2, Judul: 2, Tabel: 1, Footnote: 1, 'List-item': 1 } },
    ],
    penutupStats: { Paragraf: 2 }
  },
  {
    chapter: 'BAB III METODOLOGI PENELITIAN',
    pengantarStats: { Paragraf: 3 },
    sections: [
      { title: '3.1 Desain Penelitian', stats: { Paragraf: 15, Gambar: 2, Caption: 2, Judul: 2, Tabel: 1, Formula: 1, Footnote: 1, 'List-item': 3 } },
      { title: '3.2 Populasi dan Sampel', stats: { Paragraf: 12, Tabel: 2, Formula: 3, Judul: 1, Gambar: 1, Caption: 1, Footnote: 2, 'List-item': 2 } },
    ],
    penutupStats: { Paragraf: 1 }
  },
  {
    chapter: 'BAB IV HASIL DAN PEMBAHASAN',
    pengantarStats: { Paragraf: 4 },
    sections: [
      { title: '4.1 Hasil Penelitian', stats: { Paragraf: 40, Tabel: 5, Gambar: 4, Caption: 9, Formula: 3, Judul: 3, Footnote: 2, 'List-item': 5 } },
      { title: '4.2 Pembahasan', stats: { Paragraf: 35, Gambar: 3, Caption: 3, Tabel: 2, Formula: 2, Judul: 2, Footnote: 3, 'List-item': 2 } },
    ],
    penutupStats: { Paragraf: 2 }
  },
  {
    chapter: 'BAB V KESIMPULAN DAN SARAN',
    pengantarStats: { Paragraf: 2 },
    sections: [
      { title: '5.1 Kesimpulan', stats: { Paragraf: 8, 'List-item': 5, Judul: 1 } },
      { title: '5.2 Saran', stats: { Paragraf: 6, 'List-item': 4, Judul: 1 } },
    ],
    penutupStats: { Paragraf: 1 }
  },
];

export const errors = [
  {
    category: 'Font',
    severity: 'Tinggi',
    title: 'Font tidak sesuai. Menggunakan Arial, seharusnya Times New Roman',
    location: 'Subbab 1.2.1, Halaman 3, Paragraf 2',
    steps: [
      'Pilih seluruh teks di subbab 1.2.1 halaman 3 paragraf 2',
      'Ubah font menjadi Times New Roman ukuran 12pt',
      'Pastikan heading menggunakan Times New Roman bold'
    ],
    tips: 'Gunakan fitur "Find & Replace" di Microsoft Word untuk mengubah font secara serentak. Atur format paragraph untuk mengatur spasi.'
  },
  {
    category: 'Spasi',
    severity: 'Sedang',
    title: 'Spasi antar baris tidak konsisten (1.2 seharusnya 1.5)',
    location: 'Subbab 2.1, Halaman 8, Paragraf 5',
    steps: [
      'Pilih paragraf yang bermasalah',
      'Buka Format > Paragraph',
      'Ubah line spacing menjadi 1.5'
    ],
    tips: 'Gunakan Styles di Word untuk memastikan konsistensi spasi di seluruh dokumen.'
  },
  {
    category: 'Margin',
    severity: 'Tinggi',
    title: 'Margin kiri 2.5 cm, seharusnya 3 cm',
    location: 'Seluruh dokumen',
    steps: [
      'Buka Layout > Margins',
      'Pilih Custom Margins',
      'Ubah margin kiri menjadi 3 cm'
    ],
    tips: 'Periksa margin di setiap section untuk memastikan konsistensi.'
  },
  {
    category: 'Indentasi',
    severity: 'Sedang',
    title: 'Indentasi paragraf tidak sesuai (0.5 cm seharusnya 1 cm)',
    location: 'Subbab 1.1, Halaman 2, Paragraf 1-5',
    steps: [
      'Pilih paragraf yang bermasalah',
      'Klik kanan > Paragraph',
      'Ubah First Line Indent menjadi 1 cm'
    ],
    tips: 'Gunakan ruler untuk melihat indentasi dengan lebih jelas.'
  },
  {
    category: 'Penomoran',
    severity: 'Tinggi',
    title: 'Penomoran halaman tidak konsisten',
    location: 'Halaman 15-20',
    steps: [
      'Buka Insert > Page Number',
      'Pilih Format Page Numbers',
      'Pastikan Continue from previous section dipilih'
    ],
    tips: 'Periksa section breaks yang mungkin mempengaruhi penomoran.'
  },
  {
    category: 'Tabel',
    severity: 'Sedang',
    title: 'Caption tabel tidak sesuai format',
    location: 'Tabel 2.1, Halaman 12',
    steps: [
      'Klik kanan pada tabel',
      'Pilih Insert Caption',
      'Gunakan format "Tabel [nomor]. [judul]"'
    ],
    tips: 'Gunakan fitur Cross-reference untuk referensi tabel otomatis.'
  },
  {
    category: 'Gambar',
    severity: 'Sedang',
    title: 'Resolusi gambar terlalu rendah',
    location: 'Gambar 3.2, Halaman 25',
    steps: [
      'Hapus gambar yang ada',
      'Insert gambar dengan resolusi minimal 300 DPI',
      'Pastikan ukuran gambar sesuai dengan layout'
    ],
    tips: 'Simpan gambar dalam format PNG atau JPEG dengan kualitas tinggi.'
  },
  {
    category: 'Referensi',
    severity: 'Tinggi',
    title: 'Format referensi tidak konsisten',
    location: 'Daftar Pustaka, Halaman 45-48',
    steps: [
      'Periksa setiap entri referensi',
      'Sesuaikan dengan format APA/IEEE yang dipilih',
      'Pastikan urutan alfabetis'
    ],
    tips: 'Gunakan reference manager seperti Mendeley atau Zotero untuk konsistensi.'
  }
];
