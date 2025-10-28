# Dokumentasi Alur Kode - Aplikasi Cek TA React

## Arsitektur Aplikasi

Aplikasi ini adalah sistem validasi Tugas Akhir berbasis React dengan Vite, menggunakan Material-UI, Redux Toolkit, dan React Router.

## Struktur Utama

```
src/
├── main.jsx              # Entry point aplikasi
├── App.jsx               # Layout utama dengan sidebar & header
├── redux/                # State management
│   ├── store.js          # Konfigurasi Redux store
│   └── userSlice.js      # State autentikasi user
├── context/              # React Context
│   └── HeaderContext.jsx # Context untuk judul header dinamis
├── pages/                # Halaman-halaman aplikasi
│   ├── auth/             # Halaman autentikasi
│   ├── mahasiswa/        # Halaman untuk mahasiswa
│   └── admin/            # Halaman untuk admin
└── components/           # Komponen reusable
    ├── shared/           # Komponen bersama
    ├── mahasiswa/        # Komponen khusus mahasiswa
    └── admin/            # Komponen khusus admin
```

## Alur Aplikasi

### 1. Inisialisasi (main.jsx)

**Entry Point:**
```
main.jsx → createRoot → render aplikasi
```

**Provider Hierarchy:**
```
StrictMode
  └── Redux Provider (store)
      └── HeaderProvider (context)
          └── CssBaseline (MUI)
              └── RouterProvider (routing)
```

**Routing Structure:**
- `/` → Login
- `/mahasiswa/*` → App (Layout) → Mahasiswa Pages
- `/admin/*` → App (Layout) → Admin Pages
- `*` → NotFound

### 2. Autentikasi (Login Flow)

**File:** `pages/auth/Login.jsx`

**Alur Login:**
```
1. User input NRP & Password
2. Validasi form (tidak boleh kosong)
3. Tentukan role:
   - NRP = "admin" → role: admin
   - Lainnya → role: mahasiswa
4. Dispatch loginSuccess ke Redux
5. Navigate berdasarkan role:
   - admin → /admin
   - mahasiswa → /mahasiswa
```

**Redux State Update:**
```javascript
// userSlice.js
loginSuccess: (state, action) => {
  state.isAuthenticated = true
  state.user = action.payload.user  // NRP
  state.role = action.payload.role  // 'admin' atau 'mahasiswa'
}
```

### 3. Layout Aplikasi (App.jsx)

**Komponen Utama:**
- AppBar (Header)
- Sidebar (Navigasi)
- Main Content (Outlet untuk child routes)

**State Management:**
- `mobileOpen`: Toggle sidebar mobile
- `desktopOpen`: Toggle sidebar desktop
- `role` & `user`: Dari Redux store
- `headerInfo`: Dari HeaderContext

**Responsive Behavior:**
- Mobile (< md): Sidebar overlay
- Desktop (≥ md): Sidebar persistent

**Logout Flow:**
```
1. Click button Keluar
2. Dispatch logout() ke Redux
3. Reset state (user, role, isAuthenticated)
4. Navigate ke "/"
```

### 4. State Management

#### Redux (Global State)
**File:** `redux/userSlice.js`

**State:**
```javascript
{
  user: null,              // NRP/username
  role: null,              // 'admin' atau 'mahasiswa'
  isAuthenticated: false   // Status login
}
```

**Actions:**
- `loginSuccess(payload)`: Set user data saat login
- `logout()`: Clear user data saat logout

#### Context API (Header State)
**File:** `context/HeaderContext.jsx`

**State:**
```javascript
{
  headerInfo: { title: '' }  // Judul header dinamis
}
```

**Usage:**
```javascript
const { headerInfo, setHeaderInfo } = useHeader()
setHeaderInfo({ title: 'Dashboard' })
```

### 5. Routing & Navigation

**Mahasiswa Routes:**
```
/mahasiswa
  ├── / (index)           → Dashboard
  ├── /upload             → Upload dokumen
  ├── /template           → Template & panduan
  ├── /history            → Riwayat validasi
  └── /detail/:id         → Detail hasil validasi
```

**Admin Routes:**
```
/admin
  ├── / (index)           → Dashboard
  ├── /template           → Kelola template
  ├── /history            → Riwayat semua validasi
  └── /detail/:id         → Detail hasil validasi
```

### 6. Component Structure

#### Shared Components
- **auth/**: BrandingPanel, LoginForm
- **layout/**: Sidebar
- **ui/**: Reusable UI components (StatCard, FileUploadArea, dll)

#### Mahasiswa Components
- **dashboard/**: StatsCards, ValidationActions, ValidationHistory
- **detail/**: DocumentStructure, ErrorList, SummaryCard
- **validation/**: ValidationSummary

#### Admin Components
- **dashboard/**: StatsCards, ErrorStatistics, ActionCards, SystemInfo

### 7. Data Flow

**Typical Page Flow:**
```
1. User navigasi ke halaman
2. Component mount
3. useEffect: Fetch data (jika perlu)
4. Update local state
5. Render UI dengan data
6. User interaction → Update state → Re-render
```

**State Update Pattern:**
```
User Action
  → Event Handler
    → Update State (useState/Redux)
      → Component Re-render
        → UI Update
```

### 8. Key Features

#### Authentication
- Login dengan NRP/Password
- Role-based access (Admin/Mahasiswa)
- Protected routes dengan layout

#### Sidebar Navigation
- Responsive (mobile/desktop)
- Role-based menu items
- Active route highlighting

#### Dynamic Header
- Context-based title management
- User info display
- Logout functionality

#### Validation System
- Upload dokumen TA
- Validasi otomatis
- History tracking
- Detail error reporting

## Dependencies

**Core:**
- React 19.1.1
- React Router DOM 7.9.4
- Redux Toolkit 2.9.1

**UI:**
- Material-UI 7.3.4
- Emotion (styling)

**Utilities:**
- docx-preview 0.3.7

## Build & Dev

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## Notes

- Menggunakan Vite untuk fast refresh
- Material-UI untuk komponen UI
- Redux Toolkit untuk state management sederhana
- Context API untuk state lokal (header)
- Mock data untuk development
