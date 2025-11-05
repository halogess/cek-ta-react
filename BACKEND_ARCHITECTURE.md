# Backend Architecture - Simulasi Backend dengan Controllers

## ✅ SELESAI - Semua Logika Bisnis di Backend Layer

Semua logika bisnis telah dipindahkan ke folder `src/backend/` yang mensimulasikan backend API.

## Struktur Arsitektur

```
Frontend (Pages/Components)
    ↓ (hanya UI & event handlers)
Service Layer (services/api/)
    ↓ (hanya API calls)
Mock API Client (mockClient.js)
    ↓ (routing ke controllers)
Backend Controllers (backend/)
    ↓ (SEMUA LOGIKA BISNIS)
Mock Data (data/)
```

## Backend Controllers

### 1. `validationController.js`
**Fungsi:**
- `getAllValidations(params)` - Filter, sort, search semua validasi
- `getValidationsByUser(userId, params)` - Filter, sort validasi by user
- `getAllBookValidations(params)` - Filter, sort semua validasi buku
- `getBookValidationsByUser(userId, params)` - Filter, sort validasi buku by user
- `getJudulBukuByUser(userId)` - Ambil judul buku terbaru
- `getValidationById(id)` - Get detail validasi
- `getValidationErrors(id)` - Get errors dengan slice sesuai errorCount
- `getDocumentStructure(id)` - Get struktur dokumen
- `uploadDocument(file, metadata)` - Simulasi upload
- `uploadBook(files, metadata)` - Simulasi upload buku
- `cancelValidation(id)` - Simulasi cancel
- `downloadCertificate(id)` - Generate blob certificate

**Logika Bisnis:**
- Filtering: status, prodi, date range, search
- Sorting: terbaru, terlama
- Priority sorting: Diproses → Dalam Antrian → Others
- Data transformation

### 2. `dashboardController.js`
**Fungsi:**
- `getAdminStats()` - Kalkulasi stats admin
- `getMahasiswaDashboard(userId)` - Stats + history dokumen & buku
- `getErrorStatistics()` - Data untuk chart
- `getSystemInfo()` - System metrics

**Logika Bisnis:**
- Kalkulasi total, waiting, passed, needsFix
- Group by prodi
- Filter dan sort history
- Slice untuk recent history (top 3)

### 3. `templateController.js`
**Fungsi:**
- `getAllTemplates()` - Get semua template dengan rules
- `getActiveTemplate()` - Get template aktif
- `uploadTemplate(formData)` - Simulasi upload
- `updateTemplate(id, data)` - Simulasi update
- `deleteTemplate(id)` - Simulasi delete
- `activateTemplate(id)` - Simulasi activate
- `updateRules(id, rules)` - Simulasi update rules
- `downloadTemplate(id)` - Generate blob template

**Logika Bisnis:**
- Template data dengan format rules lengkap
- Page settings & components rules
- Active template selection

### 4. `authController.js`
**Fungsi:**
- `login(nrp, password)` - Validasi & generate token
- `logout()` - Logout handler

**Logika Bisnis:**
- Role determination (admin vs mahasiswa)
- Token generation

### 5. `settingsController.js`
**Fungsi:**
- `getMinScore()` - Get minimum score
- `updateMinScore(score)` - Update minimum score

**Logika Bisnis:**
- State management untuk settings

### 6. `userController.js`
**Fungsi:**
- `getUserByNrp(nrp)` - Get user data by NRP

**Logika Bisnis:**
- User lookup dari mock data

## Mock API Client

`mockClient.js` sekarang HANYA melakukan:
1. Network delay simulation
2. Endpoint routing
3. Parameter extraction
4. Call ke backend controllers
5. Return hasil dari controllers

**TIDAK ADA** logika bisnis di mockClient!

## Data Flow

```javascript
// 1. User clicks button
<Button onClick={handleSubmit}>Submit</Button>

// 2. Component handler (NO LOGIC)
const handleSubmit = async () => {
  const data = await validationService.getValidations(params);
  setData(data);
};

// 3. Service layer (NO LOGIC)
export const validationService = {
  getValidations: (params) => {
    return apiClient.get('/validations', { params });
  }
};

// 4. Mock Client (NO LOGIC - hanya routing)
get: async (endpoint, options) => {
  await delay();
  if (endpoint === '/validations') {
    return validationController.getAllValidations(options.params);
  }
}

// 5. Backend Controller (ALL LOGIC HERE!)
export const validationController = {
  getAllValidations: (params) => {
    let data = mockValidations;
    
    // Filtering
    if (params.status) {
      data = data.filter(v => v.status === params.status);
    }
    
    // Sorting
    if (params.sort === 'terbaru') {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    // Searching
    if (params.search) {
      data = data.filter(v => v.nama.includes(params.search));
    }
    
    return data;
  }
};
```

## Keuntungan Arsitektur Ini

### 1. **Separation of Concerns**
- Frontend: UI & UX
- Service: API interface
- Mock Client: Routing
- Backend Controllers: Business logic

### 2. **Easy Migration to Real Backend**
Ketika backend real siap:
```javascript
// Ubah VITE_USE_MOCK=false
// Backend real harus implement logic yang sama dengan controllers
```

### 3. **Testable**
```javascript
// Test controller tanpa UI
import { validationController } from './backend';

test('filter by status', () => {
  const result = validationController.getAllValidations({ status: 'Lolos' });
  expect(result.every(v => v.status === 'Lolos')).toBe(true);
});
```

### 4. **Maintainable**
- Semua logika di satu tempat (backend/)
- Mudah debug
- Mudah update logic

### 5. **Reusable**
- Controllers bisa dipanggil dari mana saja
- Logic tidak terikat dengan UI

## File Structure

```
src/
├── backend/                    # ← SEMUA LOGIKA BISNIS
│   ├── validationController.js # Validasi logic
│   ├── dashboardController.js  # Dashboard logic
│   ├── templateController.js   # Template logic
│   ├── authController.js       # Auth logic
│   ├── settingsController.js   # Settings logic
│   ├── userController.js       # User logic
│   └── index.js                # Central export
├── services/
│   └── api/
│       ├── client.js           # Real API client
│       ├── mockClient.js       # Mock routing (NO LOGIC)
│       ├── validationService.js # API interface
│       ├── dashboardService.js  # API interface
│       └── ...
├── data/
│   ├── mockData.js             # Raw data
│   └── validationData.js       # Raw data
├── pages/                      # UI only
└── components/                 # UI only
```

## Checklist ✅

- ✅ Tidak ada filtering di pages/components
- ✅ Tidak ada sorting di pages/components
- ✅ Tidak ada kalkulasi di pages/components
- ✅ Tidak ada data transformation di pages/components
- ✅ Tidak ada logika bisnis di mockClient
- ✅ Semua logika ada di backend controllers
- ✅ Frontend hanya: fetch → setState → render
- ✅ Service hanya: API calls
- ✅ Mock client hanya: routing
- ✅ Backend controllers: ALL BUSINESS LOGIC

## Cara Kerja

### Development (Mock Mode)
```
VITE_USE_MOCK=true
Frontend → Service → mockClient → Backend Controllers → Mock Data
```

### Production (Real API)
```
VITE_USE_MOCK=false
Frontend → Service → Real API Client → Real Backend
```

Backend real harus implement logic yang sama dengan controllers!

## Contoh Implementasi Backend Real

```javascript
// Backend real (Node.js/Express)
app.get('/api/validations', (req, res) => {
  const { status, prodi, search, sort } = req.query;
  
  let data = db.validations.findAll();
  
  // Filtering (sama seperti controller)
  if (status && status !== 'Semua') {
    data = data.filter(v => v.status === status);
  }
  
  // Sorting (sama seperti controller)
  if (sort === 'terbaru') {
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  
  res.json(data);
});
```

## Kesimpulan

✅ **Semua logika bisnis sekarang ada di `src/backend/`**
✅ **Frontend, Service, dan Mock Client BERSIH dari logika bisnis**
✅ **Siap untuk integrasi dengan real backend**
✅ **Mudah di-test, maintain, dan scale**
