/**
 * Validation Data - Mock data untuk detail hasil validasi
 * Berisi struktur dokumen dan daftar error untuk testing
 */

// Struktur dokumen untuk single file (1 BAB saja)
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
  }
];

// Struktur dokumen untuk book validation (multiple BAB)
export const bookDocumentStructure = [
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

// Errors untuk single file validation
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

// Errors untuk book validation (dengan fileIndex)
export const bookErrors = [
  {
    fileIndex: 1,
    category: 'Font',
    severity: 'Tinggi',
    title: 'Font tidak sesuai pada BAB 1',
    location: 'Halaman 3, Paragraf 2',
    steps: [
      'Pilih seluruh teks yang bermasalah di halaman 3 paragraf 2',
      'Klik kanan dan pilih Font atau tekan Ctrl+D',
      'Ubah font menjadi Times New Roman ukuran 12pt',
      'Klik OK untuk menerapkan perubahan'
    ],
    tips: 'Gunakan fitur "Find & Replace" (Ctrl+H) untuk mengubah semua font Arial menjadi Times New Roman sekaligus di seluruh dokumen. Ini lebih efisien daripada mengubah satu per satu.'
  },
  {
    fileIndex: 1,
    category: 'Spasi',
    severity: 'Sedang',
    title: 'Spasi antar baris tidak konsisten',
    location: 'Halaman 5, Paragraf 3-5',
    steps: [
      'Pilih paragraf 3 sampai 5 di halaman 5',
      'Klik kanan dan pilih Paragraph',
      'Di bagian Line spacing, pilih 1.5 lines',
      'Klik OK untuk menerapkan'
    ],
    tips: 'Buat Style khusus untuk paragraf body text dengan line spacing 1.5 agar konsisten di seluruh dokumen. Gunakan Home > Styles untuk membuat dan menerapkan style.'
  },
  {
    fileIndex: 2,
    category: 'Margin',
    severity: 'Tinggi',
    title: 'Margin kiri tidak sesuai',
    location: 'Seluruh BAB 2',
    steps: [
      'Buka tab Layout di ribbon',
      'Klik Margins > Custom Margins',
      'Ubah Left margin menjadi 4 cm',
      'Pastikan "Apply to: Whole document" dipilih',
      'Klik OK'
    ],
    tips: 'Periksa apakah ada section break yang membuat margin berbeda. Gunakan Show/Hide (Ctrl+Shift+8) untuk melihat section breaks tersembunyi.'
  },
  {
    fileIndex: 2,
    category: 'Tabel',
    severity: 'Sedang',
    title: 'Caption tabel tidak sesuai format',
    location: 'Tabel 2.1, Halaman 12',
    steps: [
      'Klik kanan pada tabel',
      'Pilih Insert Caption',
      'Pastikan Label adalah "Tabel"',
      'Ketik judul tabel setelah nomor',
      'Posisikan caption di atas tabel'
    ],
    tips: 'Gunakan fitur Caption otomatis agar penomoran tabel update otomatis saat menambah/menghapus tabel. Jangan ketik nomor tabel secara manual.'
  },
  {
    fileIndex: 3,
    category: 'Gambar',
    severity: 'Sedang',
    title: 'Resolusi gambar terlalu rendah',
    location: 'Gambar 3.2, Halaman 25',
    steps: [
      'Hapus gambar yang ada dengan resolusi rendah',
      'Siapkan gambar baru dengan resolusi minimal 300 DPI',
      'Insert gambar: Insert > Pictures > This Device',
      'Atur ukuran gambar agar proporsional',
      'Tambahkan caption di bawah gambar'
    ],
    tips: 'Simpan gambar dalam format PNG untuk grafik/diagram atau JPEG untuk foto. Hindari memperbesar gambar kecil karena akan blur. Gunakan gambar dengan ukuran asli yang sudah besar.'
  },
  {
    fileIndex: 4,
    category: 'Penomoran',
    severity: 'Tinggi',
    title: 'Penomoran halaman tidak konsisten',
    location: 'Halaman 30-35',
    steps: [
      'Klik di halaman yang penomorannya bermasalah',
      'Double-click pada nomor halaman untuk masuk ke Header/Footer',
      'Pastikan "Link to Previous" tidak aktif jika ingin penomoran berbeda',
      'Klik Page Number > Format Page Numbers',
      'Pilih "Continue from previous section"',
      'Klik OK dan tutup Header/Footer'
    ],
    tips: 'Gunakan Section Breaks (Layout > Breaks > Next Page) untuk memisahkan bagian dengan penomoran berbeda. Bagian awal (cover, abstrak) biasanya pakai romawi (i, ii, iii), isi pakai angka (1, 2, 3).'
  },
  {
    fileIndex: 5,
    category: 'Referensi',
    severity: 'Tinggi',
    title: 'Format referensi tidak konsisten',
    location: 'Daftar Pustaka, Halaman 45-48',
    steps: [
      'Periksa setiap entri di daftar pustaka',
      'Pastikan format sesuai standar (APA/IEEE)',
      'Urutkan secara alfabetis berdasarkan nama penulis',
      'Periksa konsistensi penggunaan italic untuk judul',
      'Pastikan semua URL dapat diakses'
    ],
    tips: 'Gunakan reference manager seperti Mendeley, Zotero, atau EndNote untuk mengelola referensi. Tools ini otomatis memformat referensi sesuai standar yang dipilih dan menjaga konsistensi.'
  },
  {
    fileIndex: 5,
    category: 'Indentasi',
    severity: 'Sedang',
    title: 'Indentasi daftar pustaka tidak sesuai (hanging indent)',
    location: 'Daftar Pustaka, Halaman 45-48',
    steps: [
      'Pilih semua entri daftar pustaka',
      'Klik kanan > Paragraph',
      'Di bagian Indentation, pilih Special: Hanging',
      'Atur By: 1 cm atau 0.5 inch',
      'Klik OK'
    ],
    tips: 'Hanging indent membuat baris pertama rata kiri, baris berikutnya menjorok ke dalam. Ini standar untuk daftar pustaka agar mudah dibaca dan nama penulis terlihat jelas.'
  }
];
