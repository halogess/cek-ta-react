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
  statusOptions = [
    { value: 'Semua', label: 'Semua Status' },
    { value: 'Dalam Antrian', label: 'Dalam Antrian' },
    { value: 'Menunggu Konfirmasi', label: 'Menunggu Konfirmasi' },
    { value: 'Selesai', label: 'Selesai' }
  ],
  sortOptions = [
    { value: 'terbaru', label: 'Terbaru' },
    { value: 'terlama', label: 'Terlama' },
    { value: 'nama', label: 'Nama File' }
  ]
}) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <TextField
        placeholder="Cari nama file..."
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
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Status</InputLabel>
        <Select value={filterStatus} label="Status" onChange={(e) => onFilterChange(e.target.value)}>
          {statusOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Urutkan</InputLabel>
        <Select value={sortBy} label="Urutkan" onChange={(e) => onSortChange(e.target.value)}>
          {sortOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
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
  );
}
