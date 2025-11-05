# Detail Validation - Backend Implementation

## ✅ Semua Data Detail Validasi Ada di Backend

Semua data untuk halaman detail validasi sudah diproses di backend controller.

## Backend Functions untuk Detail Validasi

### 1. **Struktur Dokumen** (`getDocumentStructure`)

**Lokasi:** `backend/validationController.js`

**Fungsi:**
```javascript
getDocumentStructure: (id) => {
  const validation = getValidationById(id);
  return validation?.type === 'book' 
    ? bookDocumentStructure 
    : documentStructure;
}
```

**Return Data:**
```javascript
[
  {
    chapter: 'BAB I PENDAHULUAN',
    pengantarStats: { Paragraf: 2 },
    sections: [
      { 
        title: '1.1 Latar Belakang', 
        stats: { 
          Paragraf: 45, 
          Footnote: 2, 
          Judul: 3, 
          Tabel: 1, 
          Gambar: 1 
        } 
      }
    ],
    penutupStats: { Paragraf: 1 }
  }
]
```

**Logika Backend:**
- Deteksi tipe validasi (book vs single file)
- Return struktur yang sesuai
- Data sudah terstruktur per BAB dan section

---

### 2. **Daftar Kesalahan** (`getValidationErrors`)

**Lokasi:** `backend/validationController.js`

**Fungsi:**
```javascript
getValidationErrors: (id) => {
  const validation = getValidationById(id);
  const errorList = validation?.type === 'book' ? bookErrors : errors;
  const errorCount = validation?.errorCount || 0;
  return errorList.slice(0, errorCount);
}
```

**Return Data:**
```javascript
[
  {
    category: 'Font',
    severity: 'Tinggi',
    title: 'Font tidak sesuai',
    location: 'Subbab 1.2.1, Halaman 3, Paragraf 2',
    steps: [
      'Pilih seluruh teks',
      'Ubah font menjadi Times New Roman',
      'Pastikan heading menggunakan bold'
    ],
    tips: 'Gunakan fitur Find & Replace...'
  }
]
```

**Logika Backend:**
- Deteksi tipe validasi
- Ambil error list yang sesuai
- **Slice sesuai errorCount** (backend yang tentukan berapa error yang ditampilkan)
- Return error dengan detail lengkap

---

### 3. **Rekomendasi Perbaikan** (`getRecommendations`)

**Lokasi:** `backend/validationController.js`

**Fungsi:**
```javascript
getRecommendations: (id) => {
  const validation = getValidationById(id);
  const errorList = validation?.type === 'book' ? bookErrors : errors;
  const errorCount = validation?.errorCount || 0;
  const validationErrors = errorList.slice(0, errorCount);
  
  // Generate recommendations based on error categories
  const recommendations = [];
  const categories = [...new Set(validationErrors.map(e => e.category))];
  
  if (categories.includes('Font')) {
    recommendations.push({
      title: 'Konsistensi Font',
      description: 'Gunakan fitur Styles...',
      priority: 'Tinggi'
    });
  }
  
  // ... more logic
  
  return recommendations;
}
```

**Return Data:**
```javascript
[
  {
    title: 'Konsistensi Font',
    description: 'Gunakan fitur Styles di Microsoft Word...',
    priority: 'Tinggi'
  },
  {
    title: 'Pengaturan Spasi',
    description: 'Buat Style khusus dengan line spacing 1.5...',
    priority: 'Sedang'
  }
]
```

**Logika Backend:**
- Analisis kategori error yang ada
- **Generate rekomendasi berdasarkan kategori**
- Prioritas rekomendasi (Tinggi, Sedang, Rendah)
- Return rekomendasi yang relevan

---

### 4. **Preview Dokumen** (`getDocumentPreview`)

**Lokasi:** `backend/validationController.js`

**Fungsi:**
```javascript
getDocumentPreview: (id, errorIndex) => {
  // Simulate document preview with error highlighting
  return {
    pageNumber: Math.floor(errorIndex / 3) + 1,
    previewUrl: `/preview/${id}/page-${Math.floor(errorIndex / 3) + 1}.png`,
    highlightArea: {
      x: 100 + (errorIndex % 3) * 50,
      y: 150 + (errorIndex % 5) * 40,
      width: 200,
      height: 30
    }
  };
}
```

**Return Data:**
```javascript
{
  pageNumber: 2,
  previewUrl: '/preview/123/page-2.png',
  highlightArea: {
    x: 150,
    y: 190,
    width: 200,
    height: 30
  }
}
```

**Logika Backend:**
- **Kalkulasi halaman** berdasarkan error index
- Generate preview URL
- **Kalkulasi posisi highlight** untuk error
- Return data preview siap pakai

---

## Service Layer

**Lokasi:** `services/api/validationService.js`

```javascript
export const validationService = {
  // Existing
  getValidationById: async (id) => {...},
  getDocumentStructure: async (id) => {...},
  getValidationErrors: async (id) => {...},
  
  // New
  getRecommendations: async (id) => {
    return apiClient.get(`/validations/${id}/recommendations`);
  },
  
  getDocumentPreview: async (id, errorIndex) => {
    return apiClient.get(`/validations/${id}/preview/${errorIndex}`);
  },
};
```

---

## Mock Client Routing

**Lokasi:** `services/api/mockClient.js`

```javascript
get: async (endpoint, options) => {
  // ... existing routes
  
  if (endpoint.includes('/structure')) {
    return validationController.getDocumentStructure(id);
  }
  
  if (endpoint.includes('/errors')) {
    return validationController.getValidationErrors(id);
  }
  
  if (endpoint.includes('/recommendations')) {
    return validationController.getRecommendations(id);
  }
  
  if (endpoint.includes('/preview')) {
    return validationController.getDocumentPreview(id, errorIndex);
  }
}
```

---

## Data Flow untuk Detail Validasi

```
User membuka detail validasi (id: 123)
    ↓
Component memanggil:
  - validationService.getValidationById(123)
  - validationService.getDocumentStructure(123)
  - validationService.getValidationErrors(123)
  - validationService.getRecommendations(123)
    ↓
Service memanggil mockClient
    ↓
mockClient routing ke validationController
    ↓
validationController (BACKEND LOGIC):
  ✅ Deteksi tipe validasi (book vs single)
  ✅ Slice errors sesuai errorCount
  ✅ Generate recommendations dari error categories
  ✅ Kalkulasi preview positions
  ✅ Return data terstruktur
    ↓
Component menerima data siap pakai
    ↓
Component hanya: setState → render
```

---

## Frontend Component (NO LOGIC)

```javascript
// pages/mahasiswa/DetailValidation.jsx
const fetchValidation = async () => {
  setLoading(true);
  
  // Hanya fetch, NO LOGIC
  const data = await validationService.getValidationById(id);
  setValidation(data);
  
  if (data.errorCount !== null) {
    const [structure, errors, recommendations] = await Promise.all([
      validationService.getDocumentStructure(id),
      validationService.getValidationErrors(id),
      validationService.getRecommendations(id)
    ]);
    
    // Hanya set state, NO PROCESSING
    setDocumentStructure(structure);
    setErrors(errors);
    setRecommendations(recommendations);
  }
  
  setLoading(false);
};
```

---

## Checklist ✅

- ✅ Struktur dokumen diproses di backend
- ✅ Daftar kesalahan di-slice di backend (sesuai errorCount)
- ✅ Rekomendasi di-generate di backend (dari error categories)
- ✅ Preview position di-kalkulasi di backend
- ✅ Frontend hanya fetch dan render
- ✅ Tidak ada logika bisnis di component
- ✅ Semua kalkulasi dan transformasi di backend

---

## Real Backend Implementation Guide

Ketika backend real siap, implement logic yang sama:

```javascript
// Backend API (Node.js/Express)
app.get('/api/validations/:id/recommendations', async (req, res) => {
  const { id } = req.params;
  
  // Get validation
  const validation = await db.validations.findById(id);
  
  // Get errors
  const errors = await db.errors.findByValidationId(id);
  
  // Generate recommendations (SAMA seperti controller)
  const recommendations = [];
  const categories = [...new Set(errors.map(e => e.category))];
  
  if (categories.includes('Font')) {
    recommendations.push({
      title: 'Konsistensi Font',
      description: 'Gunakan fitur Styles...',
      priority: 'Tinggi'
    });
  }
  
  res.json(recommendations);
});
```

---

## Kesimpulan

✅ **Semua data detail validasi diproses di backend:**
- Struktur dokumen
- Daftar kesalahan (dengan slice)
- Rekomendasi (generated dari error categories)
- Preview dokumen (dengan kalkulasi posisi)

✅ **Frontend hanya menampilkan data yang sudah jadi**

✅ **Siap untuk integrasi real backend**
