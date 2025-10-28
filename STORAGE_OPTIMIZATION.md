# Storage Optimization

## ❌ Masalah Sebelumnya

Project memiliki **duplikasi** penyimpanan data:
1. **Redux** - menyimpan state di runtime
2. **storage.js** - menyimpan data di localStorage

Keduanya menyimpan data yang sama (user & token), tidak efisien!

## ✅ Solusi

**Integrasikan localStorage langsung ke Redux slice**

### Perubahan yang Dilakukan

#### 1. `redux/userSlice.js` - Sekarang handle localStorage
```javascript
// Load dari localStorage saat init
const loadFromStorage = () => {
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('user_data');
  return token && user ? JSON.parse(user) : null;
};

// Auto-save ke localStorage saat login/logout
loginSuccess: (state, action) => {
  // Update Redux state
  state.isAuthenticated = true;
  state.user = action.payload.user;
  state.role = action.payload.role;
  
  // Auto-save ke localStorage
  localStorage.setItem('auth_token', action.payload.token);
  localStorage.setItem('user_data', JSON.stringify({...}));
}
```

#### 2. `pages/auth/Login.jsx` - Cukup dispatch Redux
```javascript
// Sebelumnya (duplikat):
storage.setToken(response.token);
storage.setUser(response.user);
dispatch(loginSuccess({...}));

// Sekarang (single source):
dispatch(loginSuccess({ user, role, token }));
```

#### 3. Hapus `services/utils/storage.js`
Tidak diperlukan lagi!

## 🎯 Keuntungan

✅ **Single Source of Truth** - Redux sebagai satu-satunya tempat manage state
✅ **Auto-persist** - Redux otomatis sync dengan localStorage
✅ **Auto-restore** - State otomatis restore dari localStorage saat refresh
✅ **Lebih simple** - Tidak perlu import storage di banyak tempat
✅ **Konsisten** - Redux dan localStorage selalu sync

## 📝 Cara Pakai

### Login
```javascript
dispatch(loginSuccess({ user: nrp, role, token }));
// Otomatis save ke localStorage
```

### Logout
```javascript
dispatch(logout());
// Otomatis clear localStorage
```

### Get User
```javascript
const { user, role, isAuthenticated } = useSelector(state => state.user);
// Otomatis load dari localStorage saat app start
```

## 🔄 Persistence Flow

```
App Start
  → Redux init
    → Load dari localStorage
      → Set initialState

User Login
  → dispatch(loginSuccess)
    → Update Redux state
      → Save ke localStorage

User Logout
  → dispatch(logout)
    → Clear Redux state
      → Clear localStorage

Page Refresh
  → Redux init
    → Load dari localStorage
      → User tetap login
```

## ✨ Kesimpulan

**Storage tidak perlu folder terpisah!** 

Cukup integrasikan localStorage langsung ke Redux slice untuk persistence. Lebih clean dan maintainable.
