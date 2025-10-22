import { Stack, Avatar, Typography } from '@mui/material';

export default function InfoListItem({ number, text }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar sx={{ bgcolor: '#E0E7FF', color: '#3B82F6', width: 24, height: 24, fontSize: '0.875rem', fontWeight: 'bold' }}>
        {number}
      </Avatar>
      <Typography color="text.secondary">{text}</Typography>
    </Stack>
  );
}
