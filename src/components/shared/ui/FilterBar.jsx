import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, InputAdornment } from '@mui/material';
import { SearchOutlined, RestartAlt, FilterAltOutlined } from '@mui/icons-material';



export default function FilterBar({ 
  searchQuery, 
  onSearchChange, 
  filterStatus, 
  onFilterChange, 
  sortBy, 
  onSortChange, 
  onReset,
  onApplyFilter,
  filterProdi,
  onFilterProdiChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  isAdminView = false,
  jurusanList = []
}) {
  const prodiOptions = [
    { value: 'Semua', label: 'Semua' },
    ...jurusanList.map(j => ({ value: j.kode, label: j.nama }))
  ];
  return (
    <Box>
      {/* Row 1: Search (only for admin) */}
      {(isAdminView || searchQuery !== undefined) && (
        <TextField
          placeholder={isAdminView ? "Cari nama atau NRP..." : "Cari nama file..."}
          size="small"
          value={searchQuery || ''}
          onChange={(e) => onSearchChange?.(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined />
              </InputAdornment>
            ),
          }}
        />
      )}

      {/* Row 2: Filters & Actions */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ flex: '1 1 150px' }}>
          <InputLabel id="filter-status-label">Status</InputLabel>
          <Select 
            labelId="filter-status-label"
            value={filterStatus} 
            label="Status" 
            onChange={(e) => onFilterChange(e.target.value)}
          >
            <MenuItem value="Semua">Semua</MenuItem>
            <MenuItem value="Menunggu">Menunggu</MenuItem>
            <MenuItem value="Lolos">Lolos</MenuItem>
            <MenuItem value="Tidak Lolos">Tidak Lolos</MenuItem>
            {!isAdminView && <MenuItem value="Dibatalkan">Dibatalkan</MenuItem>}
          </Select>
        </FormControl>

        {isAdminView && (
          <>
            <FormControl size="small" sx={{ flex: '1 1 150px' }}>
              <InputLabel id="filter-prodi-label">Program Studi</InputLabel>
              <Select 
                labelId="filter-prodi-label"
                value={filterProdi} 
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
              label="Dari"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: '1 1 150px' }}
            />
            <TextField
              type="date"
              size="small"
              label="Sampai"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: '1 1 150px' }}
            />
          </>
        )}

        <FormControl size="small" sx={{ flex: '1 1 130px' }}>
          <InputLabel id="filter-sort-label">Urutkan</InputLabel>
          <Select 
            labelId="filter-sort-label"
            value={sortBy} 
            label="Urutkan" 
            onChange={(e) => onSortChange(e.target.value)}
          >
            <MenuItem value="terbaru">Terbaru</MenuItem>
            <MenuItem value="terlama">Terlama</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Button 
            variant="contained" 
            size="small"
            startIcon={<FilterAltOutlined />}
            onClick={onApplyFilter}
          >
            Filter
          </Button>
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
    </Box>
  );
}
