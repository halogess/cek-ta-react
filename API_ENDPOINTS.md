# API Endpoints Documentation

## 📋 Daftar Endpoint API

### 🔐 Authentication (`authService.js`)

| Endpoint | Method | Digunakan di | Deskripsi |
|----------|--------|--------------|-----------|
| `/auth/login` | POST | `Login.jsx` | Login user (admin/mahasiswa) |
| `/auth/logout` | POST | `Layout` | Logout user |
| `/auth/me` | GET | - | Get current user info |

---

### 📄 Validations (`validationService.js`)

| Endpoint | Method | Digunakan di | Deskripsi |
|----------|--------|--------------|-----------|
| `/validations` | GET | `admin/History.jsx` | Get semua validasi (admin) |
| `/validations/user/{userId}` | GET | `mahasiswa/Dashboard.jsx`<br>`mahasiswa/History.jsx`<br>`mahasiswa/Upload.jsx` | Get validasi by user |
| `/validations/{id}` | GET | `DetailValidation.jsx` | Get detail validasi by ID |
| `/validations/upload` | POST | `Upload.jsx` | Upload dokumen untuk validasi |
| `/validations/{id}/cancel` | PUT | `mahasiswa/Dashboard.jsx`<br>`mahasiswa/History.jsx` | Batalkan validasi |
| `/validations/{id}/certificate` | GET | `Dashboard.jsx`<br>`History.jsx` | Download sertifikat (blob) |
| `/validations/{id}/errors` | GET | `DetailValidation.jsx` | Get daftar error validasi |
| `/validations/{id}/structure` | GET | `DetailValidation.jsx` | Get struktur dokumen |

---

### 📑 Templates (`templateService.js`)

| Endpoint | Method | Digunakan di | Deskripsi |
|----------|--------|--------------|-----------|
| `/templates` | GET | `admin/TemplatePanduan.jsx` | Get semua template |
| `/templates/active` | GET | `mahasiswa/TemplatePanduan.jsx`<br>`admin/SystemInfo.jsx` | Get template aktif |
| `/templates/{id}` | GET | - | Get template by ID |
| `/templates/upload` | POST | `admin/TemplatePanduan.jsx` | Upload template baru |
| `/templates/{id}` | PUT | `admin/TemplatePanduan.jsx` | Update template |
| `/templates/{id}` | DELETE | `admin/TemplatePanduan.jsx` | Delete template |
| `/templates/{id}/activate` | PUT | `admin/TemplatePanduan.jsx` | Aktifkan template |
| `/templates/{id}/rules` | PUT | `admin/TemplatePanduan.jsx` | Update format rules |
| `/templates/{id}/download` | GET | `TemplatePanduan.jsx` | Download template (blob) |

---

### 📊 Dashboard (`dashboardService.js`)

| Endpoint | Method | Digunakan di | Deskripsi |
|----------|--------|--------------|-----------|
| `/dashboard/admin/stats` | GET | `admin/StatsCards.jsx` | Get statistik admin |
| `/dashboard/mahasiswa/{userId}/stats` | GET | - | Get statistik mahasiswa |
| `/dashboard/admin/error-stats` | GET | `admin/ErrorStatistics.jsx` | Get statistik error |
| `/dashboard/admin/system-info` | GET | `admin/SystemInfo.jsx` | Get info sistem |

---

### ⚙️ Settings (`settingsService.js`)

| Endpoint | Method | Digunakan di | Deskripsi |
|----------|--------|--------------|-----------|
| `/settings/min-score` | GET | `admin/TemplatePanduan.jsx` | Get minimal skor |
| `/settings/min-score` | PUT | `admin/TemplatePanduan.jsx` | Update minimal skor |
| `/settings` | GET | - | Get semua settings |
| `/settings` | PUT | - | Update settings |

---

### 👤 Users (`userService.js`)

| Endpoint | Method | Digunakan di | Deskripsi |
|----------|--------|--------------|-----------|
| `/users/{id}` | GET | - | Get user by ID |
| `/users/nrp/{nrp}` | GET | - | Get user by NRP |
| `/users` | GET | - | Get semua users |

---

## 📁 Struktur File

```
src/
├── services/
│   ├── api/
│   │   ├── client.js              # API client utama
│   │   ├── mockClient.js          # Mock API client
│   │   ├── authService.js         # Auth endpoints
│   │   ├── validationService.js   # Validation endpoints
│   │   ├── templateService.js     # Template endpoints
│   │   ├── dashboardService.js    # Dashboard endpoints
│   │   ├── settingsService.js     # Settings endpoints
│   │   └── userService.js         # User endpoints
│   ├── utils/
│   │   ├── errorHandler.js        # Error handling
│   │   └── storage.js             # Local storage
│   └── index.js                   # Export semua services
├── data/
│   ├── mockData.js                # Mock data users & validations
│   └── validationData.js          # Mock data structure & errors
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
4. **Storage**: Token dan user info disimpan di localStorage via `storage.js`

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
