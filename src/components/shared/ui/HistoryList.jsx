import { Stack } from '@mui/material';
import AdminHistoryItem from './AdminHistoryItem';
import MahasiswaHistoryItem from './MahasiswaHistoryItem';
import DokumenHistoryItem from './DokumenHistoryItem';

export default function HistoryList({ data, onDetail, onDownload, onCancel, isAdminView = false }) {
  return (
    <Stack spacing={2}>
      {data.map((item) => {
        if (isAdminView) {
          return (
            <AdminHistoryItem
              key={item.id}
              id={item.id}
              judulTA={item.judulTA}
              judulBuku={item.judulBuku}
              filename={item.filename}
              date={item.date}
              nama={item.nama}
              nrp={item.nrp}
              jurusan={item.jurusan}
              status={item.status}
              errorCount={item.errorCount}
              skor={item.skor}
              type={item.type}
              onDetail={() => onDetail(item.id)}
            />
          );
        }
        
        if (item.type === 'book') {
          return (
            <MahasiswaHistoryItem
              key={item.id}
              id={item.id}
              judulBuku={item.judulBuku}
              filename={item.filename}
              date={item.date}
              size={item.size}
              status={item.status}
              errorCount={item.errorCount}
              type={item.type}
              bab={item.bab}
              onDetail={() => onDetail(item.id)}
              onCancel={onCancel ? () => onCancel(item.filename || item.judulBuku) : undefined}
              showCancelButton={true}
            />
          );
        }
        
        return (
          <DokumenHistoryItem
            key={item.id}
            id={item.id}
            filename={item.filename}
            date={item.date}
            size={item.size}
            status={item.status}
            errorCount={item.errorCount}
            onDetail={() => onDetail(item.id)}
            onCancel={onCancel ? () => onCancel(item.filename) : undefined}
            showCancelButton={true}
          />
        );
      })}
    </Stack>
  );
}
