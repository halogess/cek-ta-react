import { useEffect, useState } from 'react';
import { Stack, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useHeader } from '../../context/HeaderContext';
import HistoryItem from '../../components/shared/ui/HistoryItem';
import FilterBar from '../../components/shared/ui/FilterBar';
import NotificationSnackbar from '../../components/shared/ui/NotificationSnackbar';
import { getAllValidations } from '../../data/mockData';

const History = () => {
  const { setHeaderInfo } = useHeader();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [filterProdi, setFilterProdi] = useState('Semua');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('terbaru');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setHeaderInfo({ title: 'Riwayat Validasi' });
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo]);

  const handleDownloadCertificate = () => {
    setShowSuccess(true);
  };

  let filteredData = getAllValidations().filter(item => item.status === 'Lolos' || item.status === 'Tidak Lolos');

  if (filterStatus !== 'Semua') {
    filteredData = filteredData.filter(item => item.status === filterStatus);
  }

  if (filterProdi !== 'Semua') {
    filteredData = filteredData.filter(item => item.jurusan === filterProdi);
  }

  if (startDate) {
    filteredData = filteredData.filter(item => new Date(item.date) >= new Date(startDate));
  }

  if (endDate) {
    filteredData = filteredData.filter(item => new Date(item.date) <= new Date(endDate));
  }

  if (searchQuery) {
    filteredData = filteredData.filter(item => 
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nrp.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (sortBy === 'terbaru') {
    filteredData = [...filteredData].sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy === 'terlama') {
    filteredData = [...filteredData].sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  return (
    <Stack spacing={3}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          filterProdi={filterProdi}
          onFilterProdiChange={setFilterProdi}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onReset={() => {
            setFilterStatus('Semua');
            setFilterProdi('Semua');
            setStartDate('');
            setEndDate('');
            setSortBy('terbaru');
            setSearchQuery('');
          }}
          isAdminView={true}
        />

        <Stack spacing={2} sx={{ mt: 3 }}>
          {filteredData.map((item) => (
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
              onDetail={() => navigate(`/admin/detail/${item.id}`)}
              onDownload={handleDownloadCertificate}
              showCancelButton={false}
              showConfirmButton={false}
              isAdminView={true}
            />
          ))}
        </Stack>
      </Paper>

      <NotificationSnackbar
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="Sertifikat berhasil didownload!"
      />
    </Stack>
  );
};

export default History;
