import { Stack } from '@mui/material';
import HistoryItem from '../../shared/ui/HistoryItem';

export default function HistoryList({ data, onDetail, onDownload }) {
  return (
    <Stack spacing={2}>
      {data.map((item) => (
        <HistoryItem
          key={item.id}
          judulTA={item.judulTA}
          filename={item.filename}
          date={item.date}
          nama={item.nama}
          nrp={item.nrp}
          jurusan={item.jurusan}
          status={item.status}
          statusColor={item.statusColor}
          errorCount={item.errorCount}
          skor={item.skor}
          isPassedValidation={item.isPassedValidation}
          onDetail={() => onDetail(item.id)}
          onDownload={onDownload}
          showCancelButton={false}
          isAdminView={true}
        />
      ))}
    </Stack>
  );
}
