import { Stack } from '@mui/material';
import HistoryItem from './HistoryItem';

export default function HistoryList({ data, onDetail, onDownload, onCancel, isAdminView = false }) {
  return (
    <Stack spacing={2}>
      {data.map((item) => (
        <HistoryItem
          key={item.id}
          id={item.id}
          judulTA={item.judulTA}
          judulBuku={item.judulBuku}
          filename={item.filename}
          date={item.date}
          size={item.size}
          nama={item.nama}
          nrp={item.nrp}
          jurusan={item.jurusan}
          status={item.status}
          statusColor={item.statusColor}
          errorCount={item.errorCount}
          skor={item.skor}
          isPassedValidation={item.isPassedValidation}
          type={item.type}
          totalFiles={item.totalFiles}
          numChapters={item.numChapters}
          onDetail={() => onDetail(item.id)}
          onDownload={onDownload}
          onCancel={onCancel ? () => onCancel(item.filename || item.judulBuku) : undefined}
          showCancelButton={!isAdminView}
          isAdminView={isAdminView}
        />
      ))}
    </Stack>
  );
}
