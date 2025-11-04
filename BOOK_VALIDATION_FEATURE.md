# Book Validation Feature - Implementation Summary

## Overview
Fitur baru untuk validasi buku TA lengkap (multiple files) dengan skor untuk keseluruhan buku.

## Changes Made

### 1. New Page: Upload Buku (`/mahasiswa/upload-buku`)
**File**: `src/pages/mahasiswa/UploadBuku.jsx`
- Input jumlah BAB
- Kalkulasi otomatis: total file = jumlah_bab + 2
- Upload multiple files sekaligus
- Input judul buku TA
- History validasi buku di bawah form
- Alert: "History akan dihapus otomatis setiap 30 hari"

### 2. Updated: Upload Page (`/mahasiswa/upload`)
**File**: `src/pages/mahasiswa/Upload.jsx`
- Tambah history validasi file di bawah form
- Alert: "History akan dihapus otomatis setiap 30 hari"
- Filter hanya tampilkan file validation (bukan book)

### 3. New Component: BookErrorPanel
**File**: `src/components/mahasiswa/detail/BookErrorPanel.jsx`
- Menampilkan error per file dengan accordion
- Expand/collapse untuk setiap file
- Chip menunjukkan jumlah error per file

### 4. Updated: DetailValidation Page
**File**: `src/pages/mahasiswa/DetailValidation.jsx`
- Deteksi tipe validasi (file vs book)
- Jika book: tampilkan BookErrorPanel
- Jika file: tampilkan ErrorListPanel (existing)

### 5. Updated: Menu Items
**File**: `src/components/shared/layout/menuItems.js`
- Tambah menu "Unggah Buku" dengan icon MenuBookOutlined

### 6. Updated: Routing
**File**: `src/main.jsx`
- Tambah route `/mahasiswa/upload-buku` → UploadBuku component

### 7. Updated: Validation Service
**File**: `src/services/api/validationService.js`
- `uploadBook(files, metadata)` - Upload multiple files
- `getBookValidationsByUser(userId)` - Get book validations by user

### 8. Updated: Mock Data
**File**: `src/data/mockData.js`
- `mockBookValidations` - Array of book validation data
- `getBookValidationsByUser(nrp)` - Helper function
- `getBookValidationById(id)` - Helper function

### 9. Updated: Validation Data
**File**: `src/data/validationData.js`
- `bookErrors` - Array of errors dengan `fileIndex` property

### 10. Updated: Mock Client
**File**: `src/services/api/mockClient.js`
- Handle `/validations/books/user/:userId`
- Handle `/validations/upload-book`
- Return `bookErrors` untuk book validation

### 11. Updated: History Components
**Files**: 
- `src/components/shared/ui/HistoryItem.jsx`
- `src/components/shared/ui/HistoryList.jsx`

**Changes**:
- Support `type: 'book'` property
- Display `judulBuku` untuk book validation
- Display `totalFiles` instead of `size` untuk book
- Pass book-specific props

## Data Structure

### Book Validation Object
```javascript
{
  id: 101,
  type: 'book',
  userId: 1,
  nrp: '5025201001',
  nama: 'Ahmad Ridwan',
  jurusan: 'Teknik Informatika',
  judulBuku: 'Judul Buku TA',
  numChapters: 5,
  totalFiles: 7,
  files: [
    { name: 'Cover.docx', size: '0.5 MB' },
    { name: 'BAB_1.docx', size: '1.2 MB' },
    // ... more files
  ],
  date: '2024-01-18',
  status: 'Tidak Lolos',
  statusColor: 'error',
  errorCount: 15,
  skor: 72
}
```

### Book Error Object
```javascript
{
  fileIndex: 1, // Index of file in files array
  category: 'Font',
  severity: 'Tinggi',
  title: 'Font tidak sesuai pada BAB 1',
  location: 'Halaman 3, Paragraf 2',
  steps: ['Pilih teks', 'Ubah font ke Times New Roman 12pt']
}
```

## User Flow

### Upload Buku Flow
1. User navigasi ke "Unggah Buku"
2. Input jumlah BAB (misal: 5)
3. Sistem kalkulasi: 5 + 2 = 7 file
4. Input judul buku
5. Upload 7 file sekaligus
6. Klik "Mulai Validasi Buku"
7. Sistem proses validasi
8. User lihat hasil di history buku

### View Book Validation Detail
1. User klik item di history buku
2. Navigate ke `/mahasiswa/detail/:id`
3. Sistem deteksi `type: 'book'`
4. Tampilkan BookErrorPanel dengan accordion per file
5. User expand file untuk lihat error detail

## Testing

### Mock Data Available
- 2 book validations untuk testing
- User 1 (Ahmad): 1 book validation (Tidak Lolos, 15 errors)
- User 2 (Siti): 1 book validation (Lolos, 0 errors)

### Test Scenarios
1. ✅ Upload buku dengan jumlah BAB berbeda
2. ✅ View history buku terpisah dari history file
3. ✅ View detail book validation dengan error per file
4. ✅ Expand/collapse file untuk lihat error
5. ✅ Alert auto-delete history muncul

## Notes
- History file dan history buku terpisah
- File validation: `type` undefined atau tidak ada
- Book validation: `type: 'book'`
- Auto-delete period: 30 hari (hardcoded di alert)
- Rumus file: `jumlah_bab + 2`
