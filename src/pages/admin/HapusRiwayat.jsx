import { useState, useEffect } from 'react';
import { Stack, Paper, Typography, Button, Box, List, ListItem, ListItemText, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { SearchOutlined, DeleteOutline, InfoOutlined, PersonOffOutlined } from '@mui/icons-material';
import { useHeader } from '../../context/HeaderContext';
import Loading from '../../components/shared/ui/Loading';
import { bukuService, userService, handleApiError } from '../../services';

export default function HapusRiwayat() {
  const { setHeaderInfo } = useHeader();
  const [loading, setLoading] = useState(false);
  const [graduatedStudents, setGraduatedStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [jurusan, setJurusan] = useState('');
  const [angkatan, setAngkatan] = useState('');
  const [status, setStatus] = useState('');
  const [jurusanList, setJurusanList] = useState([]);
  const [angkatanList, setAngkatanList] = useState([]);
  const [statusList, setStatusList] = useState([]);

  useEffect(() => {
    setHeaderInfo({ title: 'Hapus Riwayat Validasi' });
    fetchFilters();
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo]);

  const fetchFilters = async () => {
    try {
      const [jurusanData, angkatanData, statusData] = await Promise.all([
        userService.getNonActiveJurusan(),
        userService.getNonActiveAngkatan(),
        userService.getNonActiveStatus()
      ]);
      setJurusanList(jurusanData);
      setAngkatanList(angkatanData);
      setStatusList(statusData);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = { limit: 1000, offset: 0 };
      if (jurusan) params.jurusan = jurusan;
      if (angkatan) params.angkatan = angkatan;
      if (status) params.status = status;
      
      const result = await bukuService.getBukuLulus(params);
      const data = (result.data || []).map(item => ({
        nrp: item.nrp,
        nama: item.nama,
        jurusan: item.jurusan?.singkatan || item.jurusan?.nama || '',
        angkatan: item.nrp?.substring(0, 4) || '-',
        totalBuku: item.total_buku || 0
      }));
      
      setGraduatedStudents(data);
      setSelectedStudents([]);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStudent = (nrp) => {
    setSelectedStudents(prev => 
      prev.includes(nrp) ? prev.filter(n => n !== nrp) : [...prev, nrp]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === graduatedStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(graduatedStudents.map(s => s.nrp));
    }
  };

  const handleDelete = () => {
    if (selectedStudents.length === 0) return;
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (confirmText !== 'HAPUS RIWAYAT') return;
    
    // Simulate delete
    setGraduatedStudents(prev => prev.filter(s => !selectedStudents.includes(s.nrp)));
    setSelectedStudents([]);
    setOpenConfirmDialog(false);
    setConfirmText('');
    setShowSuccess(true);
  };

  if (loading) return <Loading message="Mencari mahasiswa lulus..." />;

  return (
    <Stack spacing={3}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
          <InfoOutlined sx={{ color: '#64748B', fontSize: 20, mt: 0.3 }} />
          <Typography variant="body2" color="text.secondary">
            Hapus riwayat validasi buku dari mahasiswa yang statusnya selain aktif (mengundurkan diri, alumni, DO, dan lain-lain). Klik tombol filter untuk memulai pencarian.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Jurusan</InputLabel>
            <Select value={jurusan} onChange={(e) => setJurusan(e.target.value)} label="Jurusan">
              <MenuItem value="">Semua</MenuItem>
              {jurusanList.map(j => (
                <MenuItem key={j.kode} value={j.kode}>{j.nama}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Angkatan</InputLabel>
            <Select value={angkatan} onChange={(e) => setAngkatan(e.target.value)} label="Angkatan">
              <MenuItem value="">Semua</MenuItem>
              {angkatanList.map((a, idx) => (
                <MenuItem key={`angkatan-${idx}`} value={a}>{a}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
              <MenuItem value="">Semua Kecuali Aktif</MenuItem>
              {statusList.map(s => (
                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button 
            variant="contained" 
            startIcon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Filter
          </Button>
        </Box>
      </Paper>

      {graduatedStudents.length > 0 ? (
        <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="600">
              Mahasiswa Lulus ({graduatedStudents.length})
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined"
                onClick={handleSelectAll}
              >
                {selectedStudents.length === graduatedStudents.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
              </Button>
              <Button 
                variant="contained" 
                color="error"
                startIcon={<DeleteOutline />}
                onClick={handleDelete}
                disabled={selectedStudents.length === 0}
              >
                Hapus Terpilih ({selectedStudents.length})
              </Button>
            </Box>
          </Box>

          <List>
            {graduatedStudents.map((student) => (
              <ListItem 
                key={student.nrp}
                sx={{ 
                  border: '1px solid #E2E8F0', 
                  borderRadius: '8px', 
                  mb: 1,
                  bgcolor: selectedStudents.includes(student.nrp) ? '#FEF2F2' : 'white'
                }}
              >
                <Checkbox 
                  checked={selectedStudents.includes(student.nrp)}
                  onChange={() => handleToggleStudent(student.nrp)}
                />
                <ListItemText
                  primary={`${student.nama} (${student.nrp})`}
                  secondary={`${student.jurusan} • Angkatan ${student.angkatan} • ${student.totalBuku} validasi buku`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : !loading && (
        <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
          <PersonOffOutlined sx={{ fontSize: 64, color: '#CBD5E1', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Belum ada data mahasiswa. Gunakan filter dan klik tombol cari untuk menampilkan daftar mahasiswa lulus.
          </Typography>
        </Paper>
      )}

      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Konfirmasi Hapus Riwayat</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Anda akan menghapus riwayat validasi buku dari {selectedStudents.length} mahasiswa. Tindakan ini tidak dapat dibatalkan!
          </Alert>
          <Typography variant="body2" gutterBottom>
            Ketik <strong>HAPUS RIWAYAT</strong> untuk mengkonfirmasi:
          </Typography>
          <TextField
            fullWidth
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="HAPUS RIWAYAT"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenConfirmDialog(false); setConfirmText(''); }}>
            Batal
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            disabled={confirmText !== 'HAPUS RIWAYAT'}
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showSuccess} onClose={() => setShowSuccess(false)}>
        <DialogContent>
          <Alert severity="success">
            Berhasil menghapus riwayat validasi buku mahasiswa lulus!
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSuccess(false)}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
