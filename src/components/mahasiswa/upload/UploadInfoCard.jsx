import { Paper, Typography, Stack } from '@mui/material';
import InfoListItem from '../../shared/ui/InfoListItem';

export default function UploadInfoCard() {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight="bold">Informasi Penting</Typography>
        <InfoListItem number="1" text="Ukuran file maksimal: 20 MB" />
        <InfoListItem number="2" text="Proses validasi memakan waktu sekitar 30 menit" />
        <InfoListItem number="3" text="Anda akan menerima email setelah validasi selesai" />
      </Stack>
    </Paper>
  );
}
