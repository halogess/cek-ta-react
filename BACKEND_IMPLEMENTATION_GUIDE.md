# Backend Implementation Guide

## 📋 Controllers, Endpoints, dan Entities

Panduan lengkap untuk implementasi backend real berdasarkan logic yang ada di `src/backend/`.

---

## 1️⃣ ValidationController

### Endpoints

| Method | Endpoint | Description | Query/Body |
|--------|----------|-------------|------------|
| GET | `/api/validations` | Get all validations (admin) | `status`, `prodi`, `startDate`, `endDate`, `search`, `sort` |
| GET | `/api/validations/user/:userId` | Get validations by user | `status`, `search`, `sort` |
| GET | `/api/validations/books` | Get all book validations (admin) | `status`, `prodi`, `startDate`, `endDate`, `search`, `sort` |
| GET | `/api/validations/books/user/:userId` | Get book validations by user | `status`, `search`, `sort` |
| GET | `/api/validations/books/user/:userId/judul` | Get judul buku by user | - |
| GET | `/api/validations/:id` | Get validation by ID | - |
| GET | `/api/validations/:id/errors` | Get validation errors | - |
| GET | `/api/validations/:id/structure` | Get document structure | - |
| GET | `/api/validations/:id/recommendations` | Get recommendations | - |
| GET | `/api/validations/:id/preview/:errorIndex` | Get document preview | - |
| GET | `/api/validations/:id/certificate` | Download certificate (blob) | - |
| POST | `/api/validations/upload` | Upload document | FormData: `file`, `metadata` |
| POST | `/api/validations/upload-book` | Upload book | FormData: `files[]`, `metadata` |
| PUT | `/api/validations/:id/cancel` | Cancel validation | - |

### Entities

**Main Tables:**
- `validations` - Single file validations
- `book_validations` - Book validations
- `book_files` - Files in book
- `validation_errors` - Error details
- `document_structure` - Document chapters
- `document_sections` - Chapter sections

### Logic yang Harus Diimplementasi

```javascript
// 1. Filtering
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

if (search) {
  data = data.filter(v => 
    v.nama?.toLowerCase().includes(search.toLowerCase()) ||
    v.nrp?.toLowerCase().includes(search.toLowerCase())
  );
}

// 2. Sorting
if (sort === 'terbaru') {
  data.sort((a, b) => new Date(b.date) - new Date(a.date));
} else if (sort === 'terlama') {
  data.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// 3. Priority Sorting (untuk book validations by user)
data.sort((a, b) => {
  if (a.status === 'Diproses' && b.status !== 'Diproses') return -1;
  if (a.status !== 'Diproses' && b.status === 'Diproses') return 1;
  if (a.status === 'Dalam Antrian' && b.status !== 'Dalam Antrian' && b.status !== 'Diproses') return -1;
  if (a.status !== 'Dalam Antrian' && b.status === 'Dalam Antrian' && a.status !== 'Diproses') return 1;
  return 0;
});

// 4. Error Slicing
const errorCount = validation.errorCount || 0;
const errors = allErrors.slice(0, errorCount);

// 5. Recommendations Generation
const categories = [...new Set(errors.map(e => e.category))];
const recommendations = [];

if (categories.includes('Font')) {
  recommendations.push({
    title: 'Konsistensi Font',
    description: 'Gunakan fitur Styles di Microsoft Word...',
    priority: 'Tinggi'
  });
}
// ... more categories

// 6. Preview Calculation
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
```

---

## 2️⃣ DashboardController

### Endpoints

| Method | Endpoint | Description | Query/Body |
|--------|----------|-------------|------------|
| GET | `/api/dashboard/admin/stats` | Get admin stats | - |
| GET | `/api/dashboard/mahasiswa/:userId` | Get mahasiswa dashboard | - |
| GET | `/api/dashboard/admin/error-stats` | Get error statistics | - |
| GET | `/api/dashboard/admin/system-info` | Get system info | - |

### Entities

**Main Tables:**
- `validations`
- `book_validations`
- `users`
- `validation_errors`

### Logic yang Harus Diimplementasi

```javascript
// 1. Admin Stats
const all = [...validations, ...bookValidations];
return {
  total: all.length,
  waiting: all.filter(v => v.status === 'Dalam Antrian' || v.status === 'Diproses').length,
  passed: all.filter(v => v.status === 'Lolos').length,
  needsFix: all.filter(v => v.status === 'Tidak Lolos').length,
  usersByProdi: {
    'Teknik Informatika': 25,
    'Sistem Informasi': 18,
    // ... group by prodi
  }
};

// 2. Mahasiswa Dashboard
const dokumenData = validations.filter(v => v.nrp === userId)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const bukuData = bookValidations.filter(v => v.nrp === userId)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

return {
  dokumen: {
    stats: {
      total: dokumenData.length,
      waiting: dokumenData.filter(v => v.status === 'Dalam Antrian' || v.status === 'Diproses').length,
      passed: dokumenData.filter(v => v.status === 'Lolos').length,
      needsFix: dokumenData.filter(v => v.status === 'Tidak Lolos').length,
      cancelled: dokumenData.filter(v => v.status === 'Dibatalkan').length
    },
    history: dokumenData.slice(0, 3) // Top 3
  },
  buku: {
    stats: { /* same as dokumen */ },
    history: bukuData.slice(0, 3)
  },
  judulBuku: bukuData[0]?.judulBuku || ''
};

// 3. Error Statistics
return [
  { name: 'Format Font', count: 234, percentage: 35 },
  { name: 'Spasi Paragraf', count: 189, percentage: 28 },
  { name: 'Margin Halaman', count: 156, percentage: 23 },
  { name: 'Penomoran', count: 94, percentage: 14 }
];

// 4. System Info
return {
  todayValidations: 47,
  avgTime: 3.2,
  successRate: 71.5
};
```

---

## 3️⃣ TemplateController

### Endpoints

| Method | Endpoint | Description | Query/Body |
|--------|----------|-------------|------------|
| GET | `/api/templates` | Get all templates | - |
| GET | `/api/templates/active` | Get active template | - |
| GET | `/api/templates/:id/download` | Download template (blob) | - |
| POST | `/api/templates/upload` | Upload template | FormData: `file` |
| PUT | `/api/templates/:id` | Update template | `name`, `version` |
| PUT | `/api/templates/:id/activate` | Activate template | - |
| PUT | `/api/templates/:id/rules` | Update rules | `formatRules` |
| DELETE | `/api/templates/:id` | Delete template | - |

### Entities

**Main Tables:**
- `templates`
- `template_page_settings`
- `template_page_rules`
- `template_components`
- `template_component_rules`

### Logic yang Harus Diimplementasi

```javascript
// 1. Get All Templates (with nested rules)
return templates.map(t => ({
  id: t.id,
  name: t.name,
  version: t.version,
  rules: t.rulesCount,
  date: t.date,
  isActive: t.isActive,
  fileUrl: t.fileUrl,
  formatRules: {
    page_settings: [
      {
        id: 'a4_portrait',
        description: 'A4 Portrait (Dokumen Utama)',
        rules: [
          { value: 'Paper Size: A4', enabled: true },
          { value: 'Orientation: Portrait', enabled: true },
          // ...
        ]
      }
    ],
    components: [
      {
        id: 'judul_bab',
        name: 'Judul Bab',
        rules: [
          { value: 'Font: Times New Roman, 16pt, Bold', enabled: true },
          // ...
        ]
      }
    ]
  }
}));

// 2. Get Active Template
return templates.find(t => t.isActive === true);

// 3. Activate Template
// Set all templates isActive = false
// Set selected template isActive = true
```

---

## 4️⃣ AuthController

### Endpoints

| Method | Endpoint | Description | Query/Body |
|--------|----------|-------------|------------|
| POST | `/api/auth/login` | Login | `nrp`, `password` |
| POST | `/api/auth/logout` | Logout | - |

### Entities

**Main Tables:**
- `users`

### Logic yang Harus Diimplementasi

```javascript
// 1. Login
const user = await User.findOne({ nrp });
if (!user) throw new Error('User not found');

const isValidPassword = await bcrypt.compare(password, user.password);
if (!isValidPassword) throw new Error('Invalid password');

const token = jwt.sign({ id: user.id, nrp: user.nrp, role: user.role }, SECRET_KEY);

return {
  token,
  user: { nrp: user.nrp, role: user.role }
};

// 2. Logout
// Clear token (client-side or blacklist token)
return { message: 'Logout successful' };
```

---

## 5️⃣ SettingsController

### Endpoints

| Method | Endpoint | Description | Query/Body |
|--------|----------|-------------|------------|
| GET | `/api/settings/min-score` | Get minimum score | - |
| PUT | `/api/settings/min-score` | Update minimum score | `score` |

### Entities

**Main Tables:**
- `settings`

### Logic yang Harus Diimplementasi

```javascript
// 1. Get Min Score
const setting = await Settings.findOne({ settingKey: 'min_score' });
return { score: parseInt(setting.settingValue) };

// 2. Update Min Score
await Settings.update(
  { settingValue: score.toString() },
  { where: { settingKey: 'min_score' } }
);
return { score };
```

---

## 6️⃣ UserController

### Endpoints

| Method | Endpoint | Description | Query/Body |
|--------|----------|-------------|------------|
| GET | `/api/users/nrp/:nrp` | Get user by NRP | - |
| GET | `/api/users/:id` | Get user by ID | - |

### Entities

**Main Tables:**
- `users`

### Logic yang Harus Diimplementasi

```javascript
// 1. Get User by NRP
const user = await User.findOne({ nrp });
return {
  nrp: user.nrp,
  nama: user.nama,
  jurusan: user.jurusan,
  email: user.email
};

// 2. Get User by ID
const user = await User.findById(id);
return user;
```

---

## 📊 Summary

### Total Endpoints: 32

| Controller | Endpoints | Entities |
|------------|-----------|----------|
| ValidationController | 15 | 6 tables |
| DashboardController | 4 | 3 tables |
| TemplateController | 7 | 5 tables |
| AuthController | 2 | 1 table |
| SettingsController | 2 | 1 table |
| UserController | 2 | 1 table |

### Total Entities: 13 Tables

1. `users`
2. `validations`
3. `book_validations`
4. `book_files`
5. `validation_errors`
6. `document_structure`
7. `document_sections`
8. `templates`
9. `template_page_settings`
10. `template_page_rules`
11. `template_components`
12. `template_component_rules`
13. `settings`

---

## 🔑 Key Implementation Notes

### 1. Filtering & Sorting
- Semua filtering dan sorting HARUS sama dengan `src/backend/validationController.js`
- Priority sorting untuk book validations: Diproses → Dalam Antrian → Others

### 2. Error Handling
- Slice errors sesuai `errorCount` dari validation
- Generate recommendations dari error categories

### 3. Stats Calculation
- Kalkulasi total, waiting, passed, needsFix
- Group by prodi untuk admin stats
- Slice top 3 untuk recent history

### 4. Template Management
- Nested structure untuk formatRules
- Only one active template at a time

### 5. Authentication
- JWT token untuk session
- Role-based access (admin vs mahasiswa)

---

## 📁 Reference Files

Semua logic ada di:
- `src/backend/validationController.js`
- `src/backend/dashboardController.js`
- `src/backend/templateController.js`
- `src/backend/authController.js`
- `src/backend/settingsController.js`
- `src/backend/userController.js`

**Copy logic dari file-file ini ke backend real!**

---

## ✅ Checklist Implementation

- [ ] Setup database dengan 13 tables
- [ ] Implement ValidationController (15 endpoints)
- [ ] Implement DashboardController (4 endpoints)
- [ ] Implement TemplateController (7 endpoints)
- [ ] Implement AuthController (2 endpoints)
- [ ] Implement SettingsController (2 endpoints)
- [ ] Implement UserController (2 endpoints)
- [ ] Test semua filtering & sorting logic
- [ ] Test error slicing & recommendations
- [ ] Test stats calculation
- [ ] Setup JWT authentication
- [ ] Setup file upload handling
- [ ] Setup CORS untuk frontend
- [ ] Deploy backend
- [ ] Update frontend: `VITE_USE_MOCK=false`

---

**Status: Ready for Backend Implementation** 🚀
