import { Paper, Typography, Stack, Button } from '@mui/material';
import HistoryItem from '../../shared/ui/HistoryItem';

export default function ValidationHistory({ historyData, onCancel, onDetail, onDownload, onViewMore }) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
      <Typography variant="h6" fontWeight="bold">Riwayat Validasi Terbaru</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Dokumen yang baru saja Anda validasi
      </Typography>
      <Stack spacing={2}>
        {historyData.map((item, index) => (
          <HistoryItem
            key={index}
            filename={item.filename}
            date={item.date}
            size={item.size}
            status={item.status}
            statusColor={item.statusColor}
            errorCount={item.errorCount}
            onCancel={() => onCancel(item.filename)}
            isPassedValidation={item.isPassedValidation}
            onDetail={() => onDetail(index + 1)}
            onDownload={onDownload}
          />
        ))}
      </Stack>
      <Button 
        variant="text" 
        onClick={onViewMore}
        sx={{ mt: 2 }}
      >
        Lihat Selengkapnya
      </Button>
    </Paper>
  );
}
