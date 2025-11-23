import { useState, useEffect } from 'react';
import { Stack, Paper, Typography, Button, Box, List, ListItem, ListItemText, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, MenuItem, Select, FormControl, InputLabel, Chip, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { SearchOutlined, DeleteOutline, InfoOutlined, PersonOffOutlined, ExpandMore, ExpandLess } from '@mui/icons-material';
import { useHeader } from '../../context/HeaderContext';
import Loading from '../../components/shared/ui/Loading';
import { bukuService, userService, handleApiError } from '../../services';

export default function HapusRiwayat() {
  const { setHeaderInfo } = useHeader();
  const [loading, setLoading] = useState(false);
  const [nonaktifStudents, setNonaktifStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedBuku, setSelectedBuku] = useState({});
  const [expandedStudent, setExpandedStudent] = useState({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [jurusan, setJurusan] = useState(['']);
  const [angkatan, setAngkatan] = useState(['']);
  const [status, setStatus] = useState(['']);
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
      const filteredJurusan = jurusan.filter(j => j !== '');
      const filteredAngkatan = angkatan.filter(a => a !== '');
      const filteredStatus = status.filter(s => s !== '');
      
      if (filteredJurusan.length > 0) params.jurusan = filteredJurusan.join(',');
      if (filteredAngkatan.length > 0) params.angkatan = filteredAngkatan.join(',');
      if (filteredStatus.length > 0) params.status = filteredStatus.join(',');
      
      const result = await userService.getNonActiveMahasiswaBuku(params);
      const data = (result.data || []).map(item => ({
        nrp: item.nrp,
        nama: item.nama,
        jurusan: item.jurusan?.singkatan || item.jurusan?.nama || '',
        angkatan: item.angkatan || '-',
        statusMahasiswa: item.status_mahasiswa || '',
        totalBuku: item.total_buku || 0,
        riwayatValidasi: item.riwayat_validasi || []
      }));
      
      setNonaktifStudents(data);
      setSelectedStudents([]);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStudent = (nrp, student) => {
    const isCurrentlySelected = selectedStudents.includes(nrp);
    
    if (isCurrentlySelected) {
      setSelectedStudents(prev => prev.filter(n => n !== nrp));
      setSelectedBuku(prev => {
        const newState = { ...prev };
        delete newState[nrp];
        return newState;
      });
    } else {
      setSelectedStudents(prev => [...prev, nrp]);
      const allBukuIds = student.riwayatValidasi.map(r => r.id);
      setSelectedBuku(prev => ({ ...prev, [nrp]: allBukuIds }));
    }
  };

  const handleToggleBuku = (nrp, bukuId) => {
    setSelectedBuku(prev => {
      const current = prev[nrp] || [];
      const newBukuList = current.includes(bukuId)
        ? current.filter(id => id !== bukuId)
        : [...current, bukuId];
      
      if (newBukuList.length === 0) {
        setSelectedStudents(s => s.filter(n => n !== nrp));
        const newState = { ...prev };
        delete newState[nrp];
        return newState;
      }
      
      if (!selectedStudents.includes(nrp)) {
        setSelectedStudents(s => [...s, nrp]);
      }
      
      return { ...prev, [nrp]: newBukuList };
    });
  };

  const handleExpandStudent = (nrp) => {
    setExpandedStudent(prev => ({ ...prev, [nrp]: !prev[nrp] }));
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === nonaktifStudents.length) {
      setSelectedStudents([]);
      setSelectedBuku({});
    } else {
      setSelectedStudents(nonaktifStudents.map(s => s.nrp));
      const allBuku = {};
      nonaktifStudents.forEach(s => {
        allBuku[s.nrp] = s.riwayatValidasi.map(r => r.id);
      });
      setSelectedBuku(allBuku);
    }
  };

  const handleDelete = () => {
    if (selectedStudents.length === 0) return;
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (confirmText !== 'HAPUS RIWAYAT') return;
    
    // Simulate delete
    setNonaktifStudents(prev => prev.filter(s => !selectedStudents.includes(s.nrp)));
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
          <FormControl sx={{ flex: 1 }}>
            <InputLabel>Jurusan</InputLabel>
            <Select 
              multiple
              value={jurusan} 
              onChange={(e) => {
                const val = e.target.value;
                if (val.includes('') && !jurusan.includes('')) {
                  setJurusan(['', ...jurusanList.map(j => j.kode)]);
                } else if (!val.includes('') && jurusan.includes('')) {
                  setJurusan(['']);
                } else if (val.length === jurusanList.length && !val.includes('')) {
                  setJurusan(['', ...val]);
                } else {
                  const filtered = val.filter(v => v !== '');
                  setJurusan(filtered.length > 0 ? filtered : ['']);
                }
              }} 
              label="Jurusan"
              renderValue={(selected) => selected.includes('') ? 'Semua' : selected.map(s => jurusanList.find(j => j.kode === s)?.singkatan || s).join(', ')}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            >
              <MenuItem value="" sx={{ py: 0, minHeight: 'auto' }}>
                <Checkbox checked={jurusan.includes('')} sx={{ py: 0.5 }} />
                <ListItemText primary="Semua" sx={{ my: 0 }} />
              </MenuItem>
              {jurusanList.map(j => (
                <MenuItem key={j.kode} value={j.kode} sx={{ py: 0, minHeight: 'auto' }}>
                  <Checkbox checked={jurusan.includes('') || jurusan.includes(j.kode)} sx={{ py: 0.5 }} />
                  <ListItemText primary={j.nama} sx={{ my: 0 }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <InputLabel>Angkatan</InputLabel>
            <Select 
              multiple
              value={angkatan} 
              onChange={(e) => {
                const val = e.target.value;
                if (val.includes('') && !angkatan.includes('')) {
                  setAngkatan(['', ...angkatanList]);
                } else if (!val.includes('') && angkatan.includes('')) {
                  setAngkatan(['']);
                } else if (val.length === angkatanList.length && !val.includes('')) {
                  setAngkatan(['', ...val]);
                } else {
                  const filtered = val.filter(v => v !== '');
                  setAngkatan(filtered.length > 0 ? filtered : ['']);
                }
              }} 
              label="Angkatan"
              renderValue={(selected) => selected.includes('') ? 'Semua' : selected.join(', ')}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            >
              <MenuItem value="" sx={{ py: 0, minHeight: 'auto' }}>
                <Checkbox checked={angkatan.includes('')} sx={{ py: 0.5 }} />
                <ListItemText primary="Semua" sx={{ my: 0 }} />
              </MenuItem>
              {angkatanList.map((a, idx) => (
                <MenuItem key={`angkatan-${idx}`} value={a} sx={{ py: 0, minHeight: 'auto' }}>
                  <Checkbox checked={angkatan.includes('') || angkatan.includes(a)} sx={{ py: 0.5 }} />
                  <ListItemText primary={a} sx={{ my: 0 }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <InputLabel>Status</InputLabel>
            <Select 
              multiple
              value={status} 
              onChange={(e) => {
                const val = e.target.value;
                if (val.includes('') && !status.includes('')) {
                  setStatus(['', ...statusList.map(s => s.value)]);
                } else if (!val.includes('') && status.includes('')) {
                  setStatus(['']);
                } else if (val.length === statusList.length && !val.includes('')) {
                  setStatus(['', ...val]);
                } else {
                  const filtered = val.filter(v => v !== '');
                  setStatus(filtered.length > 0 ? filtered : ['']);
                }
              }} 
              label="Status"
              renderValue={(selected) => selected.includes('') ? 'Semua Kecuali Aktif' : selected.map(s => statusList.find(st => st.value === s)?.label || s).join(', ')}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            >
              <MenuItem value="" sx={{ py: 0, minHeight: 'auto' }}>
                <Checkbox checked={status.includes('')} sx={{ py: 0.5 }} />
                <ListItemText primary="Semua Kecuali Aktif" sx={{ my: 0 }} />
              </MenuItem>
              {statusList.map(s => (
                <MenuItem key={s.value} value={s.value} sx={{ py: 0, minHeight: 'auto' }}>
                  <Checkbox checked={status.includes('') || status.includes(s.value)} sx={{ py: 0.5 }} />
                  <ListItemText primary={s.label} sx={{ my: 0 }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            sx={{ flexShrink: 0 }} 
            variant="contained" 
            startIcon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Filter
          </Button>
        </Box>
      </Paper>

      {nonaktifStudents.length > 0 ? (
        <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="600">
              {nonaktifStudents.length} mahasiswa ditemukan
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined"
                onClick={handleSelectAll}
              >
                {selectedStudents.length === nonaktifStudents.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
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
            {nonaktifStudents.map((student) => {
              const isExpanded = expandedStudent[student.nrp];
              const selectedBukuCount = selectedBuku[student.nrp]?.length || 0;
              
              return (
                <Box key={student.nrp} sx={{ mb: 1 }}>
                  <ListItem 
                    sx={{ 
                      border: '1px solid #E2E8F0', 
                      borderRadius: '8px',
                      bgcolor: selectedStudents.includes(student.nrp) ? '#FEF2F2' : 'white'
                    }}
                  >
                    <Checkbox 
                      checked={selectedStudents.includes(student.nrp)}
                      onChange={() => handleToggleStudent(student.nrp, student)}
                    />
                    <ListItemText
                      primary={`${student.nama} (${student.nrp})`}
                      secondary={`${student.jurusan} • Angkatan ${student.angkatan} • ${student.statusMahasiswa} • ${student.totalBuku} validasi buku${selectedBukuCount > 0 ? ` (${selectedBukuCount} dipilih)` : ''}`}
                    />
                    {student.riwayatValidasi.length > 0 && (
                      <IconButton onClick={() => handleExpandStudent(student.nrp)} size="small">
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    )}
                  </ListItem>
                  
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 4, pr: 2, py: 1, bgcolor: '#F9FAFB', borderRadius: '0 0 8px 8px' }}>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell padding="checkbox" sx={{ width: 50 }}></TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Judul</TableCell>
                              <TableCell sx={{ fontWeight: 600, width: 120 }}>Tanggal Upload</TableCell>
                              <TableCell sx={{ fontWeight: 600, width: 100 }}>Jumlah Bab</TableCell>
                              <TableCell sx={{ fontWeight: 600, width: 80 }}>Skor</TableCell>
                              <TableCell sx={{ fontWeight: 600, width: 100 }}>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {student.riwayatValidasi.map((riwayat) => (
                              <TableRow 
                                key={riwayat.id} 
                                hover
                                sx={{ 
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  bgcolor: selectedBuku[student.nrp]?.includes(riwayat.id) ? '#FEF2F2' : 'transparent',
                                  '&:hover': { bgcolor: selectedBuku[student.nrp]?.includes(riwayat.id) ? '#FEE2E2' : '#F9FAFB' }
                                }}
                                onClick={() => handleToggleBuku(student.nrp, riwayat.id)}
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    size="small"
                                    checked={selectedBuku[student.nrp]?.includes(riwayat.id) || false}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleToggleBuku(student.nrp, riwayat.id);
                                    }}
                                    sx={{ transition: 'all 0.15s ease' }}
                                  />
                                </TableCell>
                                <TableCell sx={{ transition: 'all 0.2s ease' }}>{riwayat.judul}</TableCell>
                                <TableCell sx={{ transition: 'all 0.2s ease' }}>{new Date(riwayat.tanggal_upload).toLocaleDateString('id-ID')}</TableCell>
                                <TableCell align="center" sx={{ transition: 'all 0.2s ease' }}>{riwayat.jumlah_bab || '-'}</TableCell>
                                <TableCell align="center" sx={{ transition: 'all 0.2s ease' }}>{riwayat.skor || '-'}</TableCell>
                                <TableCell>
                                  <Chip 
                                    label={riwayat.status} 
                                    size="small" 
                                    color={riwayat.status === 'lolos' ? 'success' : 'default'}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
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
            Berhasil menghapus riwayat validasi buku mahasiswa non-aktif!
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSuccess(false)}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
