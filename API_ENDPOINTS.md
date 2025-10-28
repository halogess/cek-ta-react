# API Endpoints Documentation

## 📋 Daftar Endpoint API

### 🔐 Authentication (`authService.js`)

#### POST `/auth/login`
Login user (admin/mahasiswa)

**Digunakan di:** `Login.jsx`

**Request:**
```json
{
  "nrp": "5025201001",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "nrp": "5025201001",
    "role": "mahasiswa"
  }
}
```

---

#### POST `/auth/logout`
Logout user

**Digunakan di:** `Layout`

**Response:**
```json
{
  "message": "Logout successful"
}
```

---

#### GET `/auth/me`
Get current user info

**Response:**
```json
{
  "nrp": "5025201001",
  "nama": "Ahmad Ridwan",
  "role": "mahasiswa",
  "jurusan": "Teknik Informatika"
}
```

---

### 📄 Validations (`validationService.js`)

#### GET `/validations`
Get semua validasi (admin)

**Digunakan di:** `admin/History.jsx`

**Query Params:** `?status=Lolos&prodi=Teknik Informatika&startDate=2024-01-01&endDate=2024-12-31&search=Ahmad&sort=terbaru`

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "nrp": "5025201001",
    "nama": "Ahmad Ridwan",
    "jurusan": "Teknik Informatika",
    "judulTA": "Implementasi Machine Learning untuk Prediksi Cuaca",
    "filename": "Proposal_TA_2024.docx",
    "date": "2024-01-20",
    "size": "2.4 MB",
    "status": "Dalam Antrian",
    "statusColor": "info",
    "errorCount": null,
    "skor": null,
    "isPassedValidation": false,
    "queuePosition": 3
  }
]
```

---

#### GET `/validations/user/{userId}`
Get validasi by user

**Digunakan di:** `mahasiswa/Dashboard.jsx`, `mahasiswa/History.jsx`, `mahasiswa/Upload.jsx`

**Response:** Same as `/validations` (filtered by user)

---

#### GET `/validations/{id}`
Get detail validasi by ID

**Digunakan di:** `DetailValidation.jsx`

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "nrp": "5025201001",
  "nama": "Ahmad Ridwan",
  "jurusan": "Teknik Informatika",
  "judulTA": "Implementasi Machine Learning untuk Prediksi Cuaca",
  "filename": "Proposal_TA_2024.docx",
  "date": "2024-01-20",
  "size": "2.4 MB",
  "status": "Lolos",
  "statusColor": "success",
  "errorCount": 0,
  "skor": 100,
  "isPassedValidation": true
}
```

---

#### POST `/validations/upload`
Upload dokumen untuk validasi

**Digunakan di:** `Upload.jsx`

**Request:** FormData
```
file: [File]
metadata: {"judulTA": "Judul TA", "nrp": "5025201001"}
```

**Response:**
```json
{
  "id": 123,
  "status": "Dalam Antrian",
  "message": "Document uploaded successfully"
}
```

---

#### PUT `/validations/{id}/cancel`
Batalkan validasi

**Digunakan di:** `mahasiswa/Dashboard.jsx`, `mahasiswa/History.jsx`

**Response:**
```json
{
  "message": "Validation cancelled"
}
```

---

#### GET `/validations/{id}/certificate`
Download sertifikat

**Digunakan di:** `Dashboard.jsx`, `History.jsx`

**Response:** Blob (PDF file)

---

#### GET `/validations/{id}/errors`
Get daftar error validasi

**Digunakan di:** `DetailValidation.jsx`

**Response:**
```json
[
  {
    "category": "Font",
    "severity": "Tinggi",
    "title": "Font tidak sesuai. Menggunakan Arial, seharusnya Times New Roman",
    "location": "Subbab 1.2.1, Halaman 3, Paragraf 2",
    "steps": [
      "Pilih seluruh teks di subbab 1.2.1 halaman 3 paragraf 2",
      "Ubah font menjadi Times New Roman ukuran 12pt"
    ],
    "tips": "Gunakan fitur Find & Replace di Microsoft Word"
  }
]
```

---

#### GET `/validations/{id}/structure`
Get struktur dokumen

**Digunakan di:** `DetailValidation.jsx`

**Response:**
```json
[
  {
    "chapter": "BAB I PENDAHULUAN",
    "pengantarStats": { "Paragraf": 2 },
    "sections": [
      {
        "title": "1.1 Latar Belakang",
        "stats": {
          "Paragraf": 45,
          "Footnote": 2,
          "Judul": 3,
          "Tabel": 1,
          "Gambar": 1
        }
      }
    ],
    "penutupStats": { "Paragraf": 1 }
  }
]
```

---

### 📑 Templates (`templateService.js`)

#### GET `/templates`
Get semua template

**Digunakan di:** `admin/TemplatePanduan.jsx`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Panduan_TA_2024.docx",
    "version": "2025.1",
    "rules": 70,
    "date": "2024-01-15",
    "isActive": true,
    "fileUrl": "/templates/[TEMPLATE] BUKU TA - TESIS.docx",
    "formatRules": {
      "page_settings": [
        {
          "id": "a4_portrait",
          "description": "A4 Portrait (Dokumen Utama)",
          "rules": [
            { "value": "Paper Size: A4", "enabled": true },
            { "value": "Orientation: Portrait", "enabled": true },
            { "value": "Margin Top: 4cm", "enabled": true }
          ]
        }
      ],
      "components": [
        {
          "id": "judul_bab",
          "name": "Judul Bab",
          "rules": [
            { "value": "Font: Times New Roman, 16pt, Bold", "enabled": true },
            { "value": "Case: Uppercase", "enabled": true }
          ]
        }
      ]
    }
  }
]
```

---

#### GET `/templates/active`
Get template aktif

**Digunakan di:** `mahasiswa/TemplatePanduan.jsx`, `admin/SystemInfo.jsx`

**Response:** Same as single template object from `/templates`

---

#### GET `/templates/{id}`
Get template by ID

**Response:** Same as single template object

---

#### POST `/templates/upload`
Upload template baru

**Digunakan di:** `admin/TemplatePanduan.jsx`

**Request:** FormData
```
file: [File]
```

**Response:**
```json
{
  "id": 2,
  "name": "Template_1234567890.docx",
  "message": "Template uploaded successfully"
}
```

---

#### PUT `/templates/{id}`
Update template

**Digunakan di:** `admin/TemplatePanduan.jsx`

**Request:**
```json
{
  "name": "Panduan_TA_2025.docx",
  "version": "2025.2"
}
```

**Response:**
```json
{
  "message": "Template updated"
}
```

---

#### DELETE `/templates/{id}`
Delete template

**Digunakan di:** `admin/TemplatePanduan.jsx`

**Response:**
```json
{
  "message": "Deleted successfully"
}
```

---

#### PUT `/templates/{id}/activate`
Aktifkan template

**Digunakan di:** `admin/TemplatePanduan.jsx`

**Response:**
```json
{
  "message": "Template activated"
}
```

---

#### PUT `/templates/{id}/rules`
Update format rules

**Digunakan di:** `admin/TemplatePanduan.jsx`

**Request:**
```json
{
  "formatRules": {
    "page_settings": [...],
    "components": [...]
  }
}
```

**Response:**
```json
{
  "message": "Rules updated"
}
```

---

#### GET `/templates/{id}/download`
Download template

**Digunakan di:** `TemplatePanduan.jsx`

**Response:** Blob (DOCX file)

---

### 📊 Dashboard (`dashboardService.js`)

#### GET `/dashboard/admin/stats`
Get statistik admin

**Digunakan di:** `admin/StatsCards.jsx`

**Response:**
```json
{
  "total": 25,
  "waiting": 3,
  "passed": 15,
  "needsFix": 7
}
```

---

#### GET `/dashboard/mahasiswa/{userId}/stats`
Get statistik mahasiswa

**Response:**
```json
{
  "total": 5,
  "waiting": 1,
  "cancelled": 1,
  "passed": 2,
  "needsFix": 1
}
```

---

#### GET `/dashboard/admin/error-stats`
Get statistik error

**Digunakan di:** `admin/ErrorStatistics.jsx`

**Response:**
```json
[
  {
    "name": "Format Font",
    "count": 234,
    "percentage": 35
  },
  {
    "name": "Spasi Paragraf",
    "count": 189,
    "percentage": 28
  }
]
```

---

#### GET `/dashboard/admin/system-info`
Get info sistem

**Digunakan di:** `admin/SystemInfo.jsx`

**Response:**
```json
{
  "todayValidations": 47,
  "avgTime": 3.2,
  "successRate": 71.5
}
```

---

### ⚙️ Settings (`settingsService.js`)

#### GET `/settings/min-score`
Get minimal skor

**Digunakan di:** `admin/TemplatePanduan.jsx`

**Response:**
```json
{
  "score": 80
}
```

---

#### PUT `/settings/min-score`
Update minimal skor

**Digunakan di:** `admin/TemplatePanduan.jsx`

**Request:**
```json
{
  "score": 85
}
```

**Response:**
```json
{
  "score": 85
}
```

---

#### GET `/settings`
Get semua settings

**Response:**
```json
{
  "minScore": 80,
  "maxFileSize": 10485760,
  "allowedFormats": ["docx"],
  "systemMaintenance": false
}
```

---

#### PUT `/settings`
Update settings

**Request:**
```json
{
  "minScore": 85,
  "maxFileSize": 20971520
}
```

**Response:**
```json
{
  "message": "Settings updated"
}
```

---

### 👤 Users (`userService.js`)

#### GET `/users/{id}`
Get user by ID

**Response:**
```json
{
  "id": 1,
  "nrp": "5025201001",
  "nama": "Ahmad Ridwan",
  "jurusan": "Teknik Informatika",
  "email": "ahmad.ridwan@student.its.ac.id"
}
```

---

#### GET `/users/nrp/{nrp}`
Get user by NRP

**Response:** Same as `/users/{id}`

---

#### GET `/users`
Get semua users

**Response:**
```json
[
  {
    "id": 1,
    "nrp": "5025201001",
    "nama": "Ahmad Ridwan",
    "jurusan": "Teknik Informatika",
    "email": "ahmad.ridwan@student.its.ac.id"
  }
]
```

---

## 📁 Struktur File

```
src/
├── services/
│   ├── api/
│   │   ├── client.js              # API client utama
│   │   ├── mockClient.js          # Mock API client
│   │   ├── errorHandler.js        # Error handling
│   │   ├── authService.js         # Auth endpoints
│   │   ├── validationService.js   # Validation endpoints
│   │   ├── templateService.js     # Template endpoints
│   │   ├── dashboardService.js    # Dashboard endpoints
│   │   ├── settingsService.js     # Settings endpoints
│   │   └── userService.js         # User endpoints
│   └── index.js                   # Export semua services
├── data/
│   ├── mockData.js                # Mock data users & validations
│   └── validationData.js          # Mock data structure & errors
├── redux/
│   ├── store.js                   # Redux store
│   └── userSlice.js               # User state (with localStorage)
└── pages/
    ├── admin/
    │   ├── Dashboard.jsx          # dashboardService
    │   ├── History.jsx            # validationService
    │   ├── DetailValidation.jsx   # validationService
    │   └── TemplatePanduan.jsx    # templateService, settingsService
    └── mahasiswa/
        ├── Dashboard.jsx          # validationService
        ├── History.jsx            # validationService
        ├── DetailValidation.jsx   # validationService
        ├── Upload.jsx             # validationService
        └── TemplatePanduan.jsx    # templateService
```

---

## 🔄 Flow Data

### Mahasiswa Dashboard
```
mahasiswa/Dashboard.jsx
  → validationService.getValidationsByUser(user)
    → GET /validations/user/{userId}
      → mockClient.get()
        → mockData.getValidationsByUser()
```

### Admin Dashboard
```
admin/Dashboard.jsx
  → StatsCards.jsx
    → dashboardService.getAdminStats()
      → GET /dashboard/admin/stats
        → mockClient.get()
          → mockData.getAllValidations()
```

### Upload Dokumen
```
mahasiswa/Upload.jsx
  → validationService.uploadDocument(file, metadata)
    → POST /validations/upload
      → mockClient.upload()
        → Return mock validation ID
```

### Template Management
```
admin/TemplatePanduan.jsx
  → templateService.getAllTemplates()
    → GET /templates
      → mockClient.get()
        → Return mock templates with formatRules
```

---

## ⚙️ Konfigurasi

### Environment Variables (`.env`)
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK=true
```

### Switch ke Real API
Ubah `.env`:
```env
VITE_USE_MOCK=false
```

---

## 📝 Catatan

1. **Mock Mode**: Semua endpoint menggunakan `mockClient.js` dengan data dari `mockData.js` dan `validationData.js`
2. **Real API Mode**: Semua endpoint akan hit ke backend di `VITE_API_BASE_URL`
3. **Error Handling**: Semua service menggunakan `handleApiError()` dari `errorHandler.js`
4. **Persistence**: Token dan user info disimpan di localStorage via Redux `userSlice.js`

---

## 🚀 Cara Implementasi Backend

Backend harus menyediakan endpoint yang sama dengan struktur di atas:

```
Base URL: http://localhost:8000/api

POST   /auth/login
POST   /auth/logout
GET    /auth/me

GET    /validations
GET    /validations/user/:userId
GET    /validations/:id
POST   /validations/upload
PUT    /validations/:id/cancel
GET    /validations/:id/certificate
GET    /validations/:id/errors
GET    /validations/:id/structure

GET    /templates
GET    /templates/active
GET    /templates/:id
POST   /templates/upload
PUT    /templates/:id
DELETE /templates/:id
PUT    /templates/:id/activate
PUT    /templates/:id/rules
GET    /templates/:id/download

GET    /dashboard/admin/stats
GET    /dashboard/mahasiswa/:userId/stats
GET    /dashboard/admin/error-stats
GET    /dashboard/admin/system-info

GET    /settings/min-score
PUT    /settings/min-score
GET    /settings
PUT    /settings

GET    /users/:id
GET    /users/nrp/:nrp
GET    /users
```
