# Dokumentasi Status Validasi Dokumen

## Status Validasi

Sistem memiliki 5 status validasi dokumen:

### 1. Dalam Antrian
**Deskripsi:** Dokumen menunggu untuk diproses oleh sistem

**Karakteristik:**
- Setiap mahasiswa hanya dapat memiliki 1 dokumen dalam antrian
- Mahasiswa dapat membatalkan dokumen ini
- Mahasiswa tidak dapat upload dokumen baru selama ada dokumen dalam antrian
- Tidak ada data: daftar kesalahan, struktur dokumen, skor, rekomendasi perbaikan

**Warna Badge:** Info (Biru)

**Icon:** HourglassEmpty

**Aksi yang Tersedia:**
- Batalkan validasi
- Lihat detail (hanya menampilkan status antrian)

---

### 2. Diproses
**Deskripsi:** Sistem sedang memvalidasi dokumen

**Karakteristik:**
- Mahasiswa tidak dapat upload dokumen baru
- Mahasiswa tidak dapat membatalkan dokumen ini
- Proses otomatis oleh sistem
- Tidak ada data: daftar kesalahan, struktur dokumen, skor, rekomendasi perbaikan

**Warna Badge:** Warning (Kuning)

**Icon:** HourglassEmpty

**Aksi yang Tersedia:**
- Lihat detail (hanya menampilkan status diproses)

---

### 3. Lolos
**Deskripsi:** Dokumen lulus validasi

**Karakteristik:**
- Skor validasi ≥ 80%
- Memiliki data lengkap: daftar kesalahan, struktur dokumen, skor, rekomendasi perbaikan
- Mahasiswa dapat download sertifikat
- Mahasiswa dapat upload dokumen baru

**Warna Badge:** Success (Hijau)

**Icon:** CheckCircleOutline

**Aksi yang Tersedia:**
- Download sertifikat
- Lihat detail lengkap (struktur dokumen, daftar kesalahan, rekomendasi)

---

### 4. Tidak Lolos
**Deskripsi:** Dokumen tidak lulus validasi

**Karakteristik:**
- Skor validasi < 80%
- Memiliki data lengkap: daftar kesalahan, struktur dokumen, skor, rekomendasi perbaikan
- Menampilkan informasi minimum skor untuk lolos (80%)
- Mahasiswa dapat upload dokumen baru untuk perbaikan

**Warna Badge:** Error (Merah)

**Icon:** ErrorOutline

**Aksi yang Tersedia:**
- Lihat detail lengkap (struktur dokumen, daftar kesalahan, rekomendasi)
- Upload dokumen baru

---

### 5. Dibatalkan
**Deskripsi:** Validasi dokumen dibatalkan oleh mahasiswa

**Karakteristik:**
- Dokumen dibatalkan saat status "Dalam Antrian"
- Tidak ada data: daftar kesalahan, struktur dokumen, skor, rekomendasi perbaikan
- Mahasiswa dapat upload dokumen baru

**Warna Badge:** Default (Abu-abu)

**Icon:** BlockOutlined

**Aksi yang Tersedia:**
- Lihat detail (hanya menampilkan status dibatalkan)

---

## Alur Status Validasi

```
Upload Dokumen
    ↓
Dalam Antrian ──[Batalkan]──→ Dibatalkan
    ↓
Diproses
    ↓
    ├──→ Lolos (Skor ≥ 80%)
    │
    └──→ Tidak Lolos (Skor < 80%)
```

---

## Aturan Bisnis

### Upload Dokumen
- Mahasiswa hanya dapat upload jika tidak ada dokumen dengan status "Dalam Antrian" atau "Diproses"
- Jika ada dokumen "Dalam Antrian", mahasiswa harus membatalkan terlebih dahulu
- Jika ada dokumen "Diproses", mahasiswa harus menunggu hingga selesai

### Pembatalan Dokumen
- Hanya dokumen dengan status "Dalam Antrian" yang dapat dibatalkan
- Dokumen dengan status "Diproses" tidak dapat dibatalkan

### Skor Validasi
- Minimum skor untuk lolos: 80%
- Skor dihitung berdasarkan jumlah kesalahan yang ditemukan
- Skor ditampilkan dalam persentase (0-100%)

### Download Sertifikat
- Hanya tersedia untuk dokumen dengan status "Lolos"
- Sertifikat berisi informasi validasi dan konfirmasi kelulusan

---

## Tampilan UI Berdasarkan Status

### Dashboard Mahasiswa
- Menampilkan alert khusus jika ada dokumen "Diproses"
- Tombol upload disabled jika ada dokumen "Dalam Antrian" atau "Diproses"

### Halaman Upload
- Alert error jika ada dokumen "Dalam Antrian" atau "Diproses"
- Tombol upload disabled jika ada dokumen "Dalam Antrian" atau "Diproses"

### Halaman Detail Validasi

**Dalam Antrian:**
- Tampilan: Posisi antrian, tombol batalkan
- Tidak ada: Struktur dokumen, daftar kesalahan, skor

**Diproses:**
- Tampilan: Status sedang diproses
- Tidak ada: Struktur dokumen, daftar kesalahan, skor, tombol batalkan

**Lolos:**
- Tampilan: Banner sukses, tombol download sertifikat
- Ada: Struktur dokumen, daftar kesalahan (jika ada), skor

**Tidak Lolos:**
- Tampilan: Summary kesalahan dengan info minimum skor
- Ada: Struktur dokumen, daftar kesalahan, skor, rekomendasi perbaikan

**Dibatalkan:**
- Tampilan: Status dibatalkan
- Tidak ada: Struktur dokumen, daftar kesalahan, skor

---

## Data Model

```javascript
{
  id: number,
  userId: number,
  nrp: string,
  nama: string,
  jurusan: string,
  judulTA: string,
  filename: string,
  date: string,
  size: string,
  status: 'Dalam Antrian' | 'Diproses' | 'Lolos' | 'Tidak Lolos' | 'Dibatalkan',
  statusColor: 'info' | 'warning' | 'success' | 'error' | 'default',
  errorCount: number | null,  // null untuk status: Dalam Antrian, Diproses, Dibatalkan
  skor: number | null,         // null untuk status: Dalam Antrian, Diproses, Dibatalkan
  isPassedValidation: boolean,
  queuePosition: number        // hanya untuk status: Dalam Antrian
}
```
