import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, InputAdornment } from '@mui/material';
import { SearchOutlined, RestartAlt } from '@mui/icons-material';

export default function FilterBar({ 
  searchQuery, 
  onSearchChange, 
  filterStatus, 
  onFilterChange, 
  sortBy, 
  onSortChange, 
  onReset,
  filterProdi,
  onFilterProdiChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  isAdminView = false,
  statusOptions = [
    { value: 'Semua', label: 'Semua' },
    { value: 'Dalam Antrian', label: 'Dalam Antrian' },
    { value: 'Menunggu Konfirmasi', label: 'Menunggu Konfirmasi' },
    { value: 'Selesai', label: 'Selesai' },
    { value: 'Lolos', label: 'Lolos' },
    { value: 'Tidak Lolos', label: 'Tidak Lolos' }
  ],
  sortOptions = [
    { value: 'terbaru', label: 'Terbaru' },
    { value: 'terlama', label: 'Terlama' },
    { value: 'nama', label: 'Nama File' }
  ],
  prodiOptions = [
    { value: 'Semua', label: 'Semua' },
    { value: 'Teknik Informatika', label: 'Teknik Informatika' },
    { value: 'Sistem Informasi', label: 'Sistem Informasi' },
    { value: 'Teknik Komputer', label: 'Teknik Komputer' }
  ]
}) {
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <TextField
          placeholder={isAdminView ? "Cari nama atau NRP..." : "Cari nama file..."}
          size="small"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ flex: 1, minWidth: '200px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined />
              </InputAdornment>
            ),
          }}
        />
      {isAdminView ? (
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select 
            labelId="status-label"
            value={filterStatus || 'Semua'} 
            label="Status" 
            onChange={(e) => onFilterChange(e.target.value)}
          >
            <MenuItem value="Semua">Semua</MenuItem>
            <MenuItem value="Lolos">Lolos</MenuItem>
            <MenuItem value="Tidak Lolos">Tidak Lolos</MenuItem>
          </Select>
        </FormControl>
      ) : (
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select 
            labelId="status-label"
            value={filterStatus || 'Semua'} 
            label="Status" 
            onChange={(e) => onFilterChange(e.target.value)}
          >
            {statusOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {isAdminView ? (
        <>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="prodi-label">Program Studi</InputLabel>
            <Select 
              labelId="prodi-label"
              value={filterProdi || 'Semua'} 
              label="Program Studi" 
              onChange={(e) => onFilterProdiChange(e.target.value)}
            >
              {prodiOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            type="date"
            size="small"
            label="Tanggal Mulai"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            sx={{ minWidth: 180 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="date"
            size="small"
            label="Tanggal Akhir"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            sx={{ minWidth: 180 }}
            InputLabelProps={{ shrink: true }}
          />
        </>
      ) : (
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Urutkan</InputLabel>
          <Select value={sortBy} label="Urutkan" onChange={(e) => onSortChange(e.target.value)}>
            {sortOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      </Box>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="sort-label">Urutkan</InputLabel>
          <Select 
            labelId="sort-label"
            value={sortBy || 'terbaru'} 
            label="Urutkan" 
            onChange={(e) => onSortChange(e.target.value)}
          >
            <MenuItem value="terbaru">Terbaru</MenuItem>
            <MenuItem value="terlama">Terlama</MenuItem>
          </Select>
        </FormControl>
        <Button 
          variant="outlined" 
          size="small"
          startIcon={<RestartAlt />}
          onClick={onReset}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
}
