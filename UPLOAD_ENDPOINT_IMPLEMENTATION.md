# Upload Endpoint Implementation

## Summary
Implemented the document upload endpoint integration with automatic token refresh handling.

## Changes Made

### 1. API Client (`src/services/api/client.js`)
- Added `refreshAccessToken()` function to refresh expired access tokens
- Added `fetchWithTokenRefresh()` wrapper to automatically retry requests after token refresh
- Updated all HTTP methods (GET, POST, PUT, DELETE, upload) to use token refresh wrapper
- Improved error handling with proper status codes and error data propagation
- Auto-redirect to login page when refresh token fails

### 2. Validation Service (`src/services/api/validationService.js`)
- Updated `uploadDocument()` to match new API specification:
  - Endpoint: `POST /api/dokumen`
  - Removed metadata parameter (only file required)
  - Returns: `{ message, dokumen_id }`

### 3. Upload Dialog (`src/components/mahasiswa/upload/CekDokumenDialog.jsx`)
- Added loading state during upload
- Added error display with Alert component
- Added CircularProgress indicator on submit button
- Proper error message handling from API responses
- Disabled form controls during upload

### 4. Upload Page (`src/pages/mahasiswa/CekDokumen.jsx`)
- Updated `handleCreateSubmit()` to propagate errors to dialog
- Proper dialog closing after successful upload

## API Endpoint Specification

### Request
```
POST /api/dokumen
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Field: file (must be .docx)
```

### Responses

**Success (200)**
```json
{
  "message": "Dokumen berhasil diupload",
  "dokumen_id": 4
}
```

**Unauthorized (401)**
```json
{
  "message": "NRP tidak ditemukan"
}
```

**Bad Request (400)**
```json
{
  "message": "File tidak boleh kosong"
}
```
```json
{
  "message": "Ekstensi file tidak diizinkan. Hanya .docx yang diperbolehkan."
}
```
```json
{
  "message": "File harus dibuat dengan Microsoft Word. Aplikasi pembuat: LibreOffice"
}
```

**Server Error (500)**
```json
{
  "message": "Terjadi kesalahan",
  "error": "error detail"
}
```

## Token Refresh Flow

1. User makes API request with access token
2. If token is expired (401 response):
   - Automatically call `POST /api/auth/refresh` with refresh token
   - Update access token in localStorage
   - Retry original request with new token
3. If refresh fails:
   - Clear localStorage
   - Redirect to login page

## Error Handling

All API errors are properly caught and displayed to users:
- Network errors
- Validation errors (file type, empty file, etc.)
- Authentication errors (auto-handled with token refresh)
- Server errors

## Testing

To test the implementation:
1. Set `VITE_USE_MOCK=false` in `.env`
2. Ensure backend is running
3. Login as mahasiswa
4. Navigate to "Cek Dokumen"
5. Click "Cek Dokumen Baru"
6. Upload a .docx file
7. Verify proper error messages for invalid files
8. Verify success message for valid uploads
9. Test token expiration by waiting or manually expiring token
