# Backend Logic Requirements

## Prinsip Arsitektur
**Frontend hanya untuk presentasi, Backend untuk semua business logic**

Frontend hanya boleh:
- Menerima data dari API
- Menampilkan data
- Mengirim user input ke API
- Handle UI state (dialog open/close, loading, etc)

Backend harus handle:
- Semua filtering
- Semua sorting
- Semua perhitungan statistik
- Semua validasi data
- Semua transformasi data

---

## 1. Dashboard Service

### Current State (Frontend Logic)
```javascript
// Di mockClient.js - LOGIC ADA DI FRONTEND
const dokumenData = getValidationsByUser(userId).sort((a, b) => new Date(b.date) - new Date(a.date));
const bukuData = getBookValidationsByUser(userId).sort((a, b) => new Date(b.date) - new Date(a.date));

return {
  dokumen: {
    stats: {
      total: dokumenData.length,
      waiting: dokumenData.filter(v => v.status === 'Dalam Antrian' || v.status === 'Diproses').length,
      passed: dokumenData.filter(v => v.status === 'Lolos').length,
      needsFix: dokumenData.filter(v => v.status === 'Tidak Lolos').length,
      cancelled: dokumenData.filter(v => v.status === 'Dibatalkan').length
    },
    history: dokumenData.slice(0, 3)
  },
  // ...
};
```

### Required Backend Implementation
**Endpoint:** `GET /dashboard/mahasiswa/{userId}`

**Backend harus:**
- Query database untuk dokumen dan buku by userId
- Hitung semua statistik di database (COUNT, WHERE clauses)
- Sort by date DESC di database
- Limit 3 untuk history di database
- Return data yang sudah siap tampil

**Response:**
```json
{
  "dokumen": {
    "stats": {
      "total": 10,
      "waiting": 2,
      "passed": 5,
      "needsFix": 2,
      "cancelled": 1
    },
    "history": [
      {
        "id": 1,
        "filename": "BAB_1.docx",
        "status": "Lolos",
        "score": 85,
        "date": "2024-01-15T10:30:00Z",
        "errorCount": 5
      }
    ]
  },
  "buku": {
    "stats": { /* sama seperti dokumen */ },
    "history": [ /* sama seperti dokumen */ ]
  },
  "judulBuku": "Sistem Informasi..."
}
```

---

## 2. Validation Service - Filtering & Sorting

### Current State (Frontend Logic)
```javascript
// Di mockClient.js - FILTERING DAN SORTING DI FRONTEND
if (status && status !== 'Semua') {
  if (status === 'Menunggu') {
    data = data.filter(v => v.status === 'Dalam Antrian' || v.status === 'Diproses');
  } else {
    data = data.filter(v => v.status === status);
  }
}

if (search) {
  data = data.filter(v => 
    v.nama?.toLowerCase().includes(search.toLowerCase()) ||
    v.nrp?.toLowerCase().includes(search.toLowerCase())
  );
}

if (sort === 'terbaru') {
  data.sort((a, b) => new Date(b.date) - new Date(a.date));
}
```

### Required Backend Implementation

**Endpoint:** `GET /validations/user/{userId}`

**Query Parameters:**
- `status` - Filter by status (Semua, Menunggu, Lolos, Tidak Lolos, Dibatalkan)
- `search` - Search in filename
- `sort` - Sort order (terbaru, terlama)

**Backend harus:**
- Build SQL query dengan WHERE clauses untuk filtering
- Handle "Menunggu" sebagai (status IN ('Dalam Antrian', 'Diproses'))
- Search dengan LIKE/ILIKE di database
- Sort dengan ORDER BY di database
- Return hasil yang sudah terfilter dan tersort

**Response:**
```json
[
  {
    "id": 1,
    "filename": "BAB_1.docx",
    "status": "Lolos",
    "score": 85,
    "date": "2024-01-15T10:30:00Z",
    "errorCount": 5,
    "queuePosition": null
  }
]
```

---

## 3. Admin Dashboard - Statistics

### Current State (Frontend Logic)
```javascript
// Di mockClient.js - PERHITUNGAN STATS DI FRONTEND
const all = getAllValidations();
return {
  total: all.length,
  waiting: all.filter(v => v.status === 'Dalam Antrian' || v.status === 'Diproses').length,
  passed: all.filter(v => v.status === 'Lolos').length,
  needsFix: all.filter(v => v.status === 'Tidak Lolos').length
};
```

### Required Backend Implementation

**Endpoint:** `GET /dashboard/admin/stats`

**Backend harus:**
- Query database dengan COUNT dan GROUP BY
- Hitung statistik per prodi
- Return data agregat

**Response:**
```json
{
  "total": 150,
  "waiting": 25,
  "passed": 90,
  "needsFix": 35,
  "usersByProdi": {
    "Teknik Informatika": 80,
    "Sistem Informasi": 50,
    "Teknologi Informasi": 20
  }
}
```

---

## 4. Admin Validation List - Advanced Filtering

### Current State (Frontend Logic)
```javascript
// Di mockClient.js - COMPLEX FILTERING DI FRONTEND
if (prodi && prodi !== 'Semua') {
  data = data.filter(v => v.jurusan === prodi);
}

if (startDate) {
  data = data.filter(v => new Date(v.date) >= new Date(startDate));
}

if (endDate) {
  data = data.filter(v => new Date(v.date) <= new Date(endDate));
}
```

### Required Backend Implementation

**Endpoint:** `GET /validations`

**Query Parameters:**
- `status` - Filter by status
- `prodi` - Filter by program studi
- `startDate` - Filter by date range start
- `endDate` - Filter by date range end
- `search` - Search in nama, nrp, filename
- `sort` - Sort order

**Backend harus:**
- Build dynamic SQL query dengan multiple WHERE conditions
- Handle date range filtering
- Handle multi-field search (nama OR nrp OR filename)
- Return paginated results (optional: add page & limit params)

---

## 5. Book Validations - Special Sorting

### Current State (Frontend Logic)
```javascript
// Di mockClient.js - CUSTOM SORTING DI FRONTEND
data.sort((a, b) => {
  if (a.status === 'Diproses' && b.status !== 'Diproses') return -1;
  if (a.status !== 'Diproses' && b.status === 'Diproses') return 1;
  if (a.status === 'Dalam Antrian' && b.status !== 'Dalam Antrian' && b.status !== 'Diproses') return -1;
  // ...
});
```

### Required Backend Implementation

**Endpoint:** `GET /validations/books/user/{userId}`

**Backend harus:**
- Sort dengan CASE WHEN di SQL untuk priority sorting
- Diproses first, then Dalam Antrian, then others
- Apply additional sort by date within same status

**SQL Example:**
```sql
ORDER BY 
  CASE 
    WHEN status = 'Diproses' THEN 1
    WHEN status = 'Dalam Antrian' THEN 2
    ELSE 3
  END,
  date DESC
```

---

## 6. Error Statistics

### Current State (Hardcoded)
```javascript
// Di mockClient.js - DATA HARDCODED
return [
  { name: 'Format Font', count: 234, percentage: 35 },
  { name: 'Spasi Paragraf', count: 189, percentage: 28 },
  // ...
];
```

### Required Backend Implementation

**Endpoint:** `GET /dashboard/admin/error-stats`

**Backend harus:**
- Query database untuk aggregate error counts by category
- Hitung percentage dari total errors
- Return top error categories

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

## 7. System Info

### Current State (Hardcoded)
```javascript
// Di mockClient.js - DATA HARDCODED
return {
  todayValidations: 47,
  avgTime: 3.2,
  successRate: 71.5
};
```

### Required Backend Implementation

**Endpoint:** `GET /dashboard/admin/system-info`

**Backend harus:**
- Query validations created today (WHERE date >= today)
- Calculate average processing time dari completed validations
- Calculate success rate (passed / total completed * 100)

**Response:**
```json
{
  "todayValidations": 47,
  "avgTime": 3.2,
  "successRate": 71.5
}
```

---

## 8. Template Management

### Current State (Data Embedded in Code)
```javascript
// Di mockClient.js - TEMPLATE DATA HARDCODED
const allTemplates = [
  {
    id: 1,
    name: 'Panduan_TA_2024.docx',
    formatRules: { /* huge nested object */ }
  }
];
```

### Required Backend Implementation

**Endpoint:** `GET /templates`

**Backend harus:**
- Store templates in database
- Store formatRules as JSON column
- Return all templates with rules

**Endpoint:** `GET /templates/active`

**Backend harus:**
- Query template WHERE isActive = true
- Return single active template with full rules

---

## 9. Validation Detail

### Current State (Mock Data)
```javascript
// Di validationData.js - MOCK DATA
export const errors = [ /* array of errors */ ];
export const documentStructure = [ /* array of chapters */ ];
```

### Required Backend Implementation

**Endpoint:** `GET /validations/{id}/errors`

**Backend harus:**
- Query errors table WHERE validation_id = {id}
- Return errors dengan semua detail (category, severity, location, etc)

**Endpoint:** `GET /validations/{id}/structure`

**Backend harus:**
- Query document structure dari validation result
- Return chapter hierarchy dengan statistics

---

## 10. File Upload

### Current State (Mock Response)
```javascript
// Di mockClient.js
upload: async (endpoint, formData) => {
  await delay(1000);
  return {
    id: Date.now(),
    status: 'Dalam Antrian',
    message: 'Document uploaded successfully'
  };
}
```

### Required Backend Implementation

**Endpoint:** `POST /validations/upload`

**Backend harus:**
- Receive file dan metadata
- Validate file type (.docx only)
- Validate file size
- Store file di storage (S3/local)
- Create validation record in database
- Add to processing queue
- Return validation ID dan status

**Endpoint:** `POST /validations/upload-book`

**Backend harus:**
- Receive multiple files
- Validate each file
- Store all files
- Create book validation record
- Link all files to validation
- Add to processing queue

---

## Summary of Changes Needed

### Frontend Changes (Simplification)
1. **Remove all filtering logic** - Just pass params to API
2. **Remove all sorting logic** - Backend returns sorted data
3. **Remove all statistics calculation** - Backend returns calculated stats
4. **Remove mock data files** - Use real API responses
5. **Simplify mockClient** - Only for development, minimal logic

### Backend Requirements
1. **Implement all filtering in SQL queries**
2. **Implement all sorting in SQL ORDER BY**
3. **Calculate all statistics in database (COUNT, AVG, etc)**
4. **Return ready-to-display data**
5. **Handle pagination at database level**
6. **Store all configuration in database (templates, rules, settings)**

### Benefits
- ✅ Faster frontend (no heavy computation)
- ✅ Consistent data (single source of truth)
- ✅ Scalable (database optimized for queries)
- ✅ Maintainable (logic in one place)
- ✅ Testable (backend logic easier to test)
- ✅ Secure (business rules not exposed to client)

---

## Implementation Priority

### Phase 1 (Critical)
1. Dashboard stats calculation
2. Validation list filtering & sorting
3. Upload file handling

### Phase 2 (Important)
4. Error statistics
5. System info metrics
6. Template management

### Phase 3 (Enhancement)
7. Advanced filtering (date range, multi-field search)
8. Pagination
9. Performance optimization

---

## Frontend Code After Backend Implementation

### Example: Dashboard Page (Simplified)
```javascript
// BEFORE: Logic di frontend
const dokumenStats = {
  total: dokumenData.length,
  waiting: dokumenData.filter(v => v.status === 'Dalam Antrian').length,
  // ...
};

// AFTER: Hanya terima dan tampilkan
const { dokumen, buku, judulBuku } = await dashboardService.getMahasiswaDashboard(user);
// dokumen.stats sudah berisi { total, waiting, passed, needsFix, cancelled }
// dokumen.history sudah berisi 3 data terbaru
```

### Example: Validation List (Simplified)
```javascript
// BEFORE: Filtering di frontend
let data = await validationService.getValidationsByUser(user);
if (status !== 'Semua') {
  data = data.filter(v => v.status === status);
}
data.sort((a, b) => new Date(b.date) - new Date(a.date));

// AFTER: Backend handle semua
const data = await validationService.getValidationsByUser(user, {
  status: filterStatus,
  search: searchQuery,
  sort: sortBy
});
// Data sudah terfilter dan tersort dari backend
```

---

## Notes for Backend Developer

1. **Use database features**: Leverage SQL for filtering, sorting, aggregation
2. **Optimize queries**: Use indexes on frequently filtered columns (status, date, userId)
3. **Return consistent format**: Always return same structure for same endpoint
4. **Handle edge cases**: Empty results, invalid params, etc
5. **Add pagination**: For large datasets, implement limit/offset or cursor-based pagination
6. **Cache when possible**: Stats that don't change often can be cached
7. **Validate input**: All user input must be validated before processing
8. **Error handling**: Return meaningful error messages with proper HTTP status codes
