# Services Layer

Folder ini berisi semua logic untuk komunikasi dengan backend API.

## Struktur

```
services/
├── api/                    # API service modules
│   ├── client.js          # HTTP client (fetch wrapper)
│   ├── authService.js     # Authentication endpoints
│   ├── validationService.js # Validation endpoints
│   ├── templateService.js # Template endpoints
│   ├── settingsService.js # Settings endpoints
│   └── userService.js     # User endpoints
├── utils/                 # Utility functions
│   ├── errorHandler.js    # Error handling utilities
│   └── storage.js         # LocalStorage utilities
└── index.js              # Export all services

```

## Penggunaan

### Import Services
```javascript
import { authService, validationService } from '../services';
```

### Contoh Penggunaan

#### Authentication
```javascript
const handleLogin = async (nrp, password) => {
  try {
    const response = await authService.login(nrp, password);
    storage.setToken(response.token);
    storage.setUser(response.user);
  } catch (error) {
    const errorInfo = handleApiError(error);
    console.error(errorInfo.message);
  }
};
```

#### Validation
```javascript
const fetchValidations = async () => {
  try {
    const data = await validationService.getAllValidations({ status: 'Lolos' });
    setValidations(data);
  } catch (error) {
    const errorInfo = handleApiError(error);
    console.error(errorInfo.message);
  }
};
```

#### Upload Document
```javascript
const handleUpload = async (file) => {
  try {
    const metadata = { userId: user.id, judulTA: 'Judul TA' };
    const response = await validationService.uploadDocument(file, metadata);
    console.log('Upload success:', response);
  } catch (error) {
    const errorInfo = handleApiError(error);
    console.error(errorInfo.message);
  }
};
```

## Konfigurasi

Set API base URL di file `.env`:
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK=true  # Set false untuk gunakan real API
```

## Mock Mode

Service sudah dilengkapi dengan mock mode untuk development tanpa backend:
- Set `VITE_USE_MOCK=true` untuk gunakan mock data
- Set `VITE_USE_MOCK=false` untuk gunakan real API
- Mock mode mensimulasikan network delay (500ms-1000ms)

## Migrasi dari Mock Data

Untuk migrasi dari mock data ke API:

1. Replace import dari `mockData.js` dengan service yang sesuai
2. Tambahkan error handling dengan `handleApiError`
3. Tambahkan loading state untuk async operations
4. Update Redux actions untuk handle async dengan Redux Thunk/RTK Query

### Before (Mock Data)
```javascript
import { getAllValidations } from '../../data/mockData';
const data = getAllValidations();
```

### After (API Service)
```javascript
import { validationService, handleApiError } from '../../services';

const fetchData = async () => {
  try {
    setLoading(true);
    const data = await validationService.getAllValidations();
    setValidations(data);
  } catch (error) {
    const errorInfo = handleApiError(error);
    setError(errorInfo.message);
  } finally {
    setLoading(false);
  }
};
```
