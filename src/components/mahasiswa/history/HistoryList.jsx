import { Stack } from '@mui/material';
import HistoryItem from '../../shared/ui/HistoryItem';

export default function HistoryList({ data, onDetail, onDownload, onCancel }) {
  return (
    <Stack spacing={2}>
      {data.map((item) => (
        <HistoryItem
          key={item.id}
          filename={item.filename}
          date={item.date}
          size={item.size}
          status={item.status}
          statusColor={item.statusColor}
          errorCount={item.errorCount}
          onCancel={() => onCancel(item.filename)}
          isPassedValidation={item.isPassedValidation}
          onDetail={() => onDetail(item.id)}
          onDownload={onDownload}
        />
      ))}
    </Stack>
  );
}
