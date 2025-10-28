import { Box, Typography, FormControl, Select, MenuItem } from '@mui/material';

export default function DataInfo({ startIndex, endIndex, totalData, rowsPerPage, onRowsPerPageChange }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, mb: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Menampilkan {startIndex + 1}-{Math.min(endIndex, totalData)} dari {totalData} data
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">Tampilkan:</Typography>
        <FormControl size="small">
          <Select value={rowsPerPage} onChange={onRowsPerPageChange} sx={{ minWidth: 80 }}>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
