import { useEffect, useState } from 'react';
import { Stack, Paper, Pagination, Box } from '@mui/material';
import Loading from '../../components/shared/ui/Loading';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useHeader } from '../../context/HeaderContext';
import FilterBar from '../../components/shared/ui/FilterBar';
import NotificationSnackbar from '../../components/shared/ui/NotificationSnackbar';
import DataInfo from '../../components/shared/ui/DataInfo';
import HistoryList from '../../components/shared/ui/HistoryList';
import { validationService, jurusanService, handleApiError } from '../../services';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} ${hours}:${minutes}`;
};

const History = () => {
  const { setHeaderInfo } = useHeader();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusFromUrl = searchParams.get('status') || 'Semua';
  const prodiFromUrl = searchParams.get('prodi') || 'Semua';
  const [filterStatus, setFilterStatus] = useState(statusFromUrl);
  const [filterProdi, setFilterProdi] = useState(prodiFromUrl);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('terbaru');
  const [searchQuery, setSearchQuery] = useState('');
  const [tempFilterStatus, setTempFilterStatus] = useState(statusFromUrl);
  const [tempFilterProdi, setTempFilterProdi] = useState(prodiFromUrl);
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');
  const [tempSortBy, setTempSortBy] = useState('terbaru');
  const [tempSearchQuery, setTempSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [allData, setAllData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jurusanList, setJurusanList] = useState([]);

  useEffect(() => {
    setHeaderInfo({ title: 'Riwayat Validasi Buku Lengkap' });
    fetchJurusan();
    return () => setHeaderInfo({ title: '' });
  }, [setHeaderInfo]);

  const fetchJurusan = async () => {
    try {
      const data = await jurusanService.getAllJurusan();
      setJurusanList(data);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchValidations();
  }, [filterStatus, filterProdi, startDate, endDate, sortBy, searchQuery, page, rowsPerPage]);



  const fetchValidations = async () => {
    try {
      setLoading(true);
      const backendParams = {};
      
      if (filterStatus !== 'Semua') {
        if (filterStatus === 'Menunggu') {
          backendParams.status = 'dalam_antrian,diproses';
        } else {
          const statusMap = {
            'Dibatalkan': 'dibatalkan',
            'Dalam Antrian': 'dalam_antrian',
            'Diproses': 'diproses',
            'Lolos': 'lolos',
            'Tidak Lolos': 'tidak_lolos'
          };
          backendParams.status = statusMap[filterStatus];
        }
      }
      
      if (filterProdi !== 'Semua') {
        backendParams.jurusan = filterProdi;
      }
      
      if (searchQuery) {
        backendParams.search = searchQuery;
      }
      
      if (startDate) {
        backendParams.startDate = startDate;
      }
      
      if (endDate) {
        backendParams.endDate = endDate;
      }
      
      backendParams.sort = sortBy === 'terlama' ? 'asc' : 'desc';
      backendParams.limit = rowsPerPage;
      backendParams.offset = (page - 1) * rowsPerPage;
      
      console.log('📋 Fetching buku with params:', backendParams);
      const result = await validationService.getAllBookValidations(backendParams);
      console.log('📋 Buku result:', result);
      
      const transformedData = (result.data || []).map(item => ({
        id: item.id,
        type: 'book',
        filename: `#${item.id}`,
        judulBuku: item.judul,
        date: formatDate(item.tanggal_upload),
        numChapters: item.jumlah_bab,
        status: item.status === 'dalam_antrian' ? 'Dalam Antrian' : 
                item.status === 'diproses' ? 'Diproses' :
                item.status === 'lolos' ? 'Lolos' :
                item.status === 'tidak_lolos' ? 'Tidak Lolos' : 'Dibatalkan',
        errorCount: item.jumlah_kesalahan,
        skor: item.skor,
        nrp: item.nrp,
        nama: item.nama,
        jurusan: item.singkatan || item.jurusan
      }));
      
      console.log('📋 Transformed data:', transformedData);
      setAllData(transformedData);
      setTotalData(result.total || 0);
    } catch (error) {
      console.error('❌ Error fetching validations:', error);
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilterStatus(statusFromUrl);
    setTempFilterStatus(statusFromUrl);
  }, [statusFromUrl]);

  useEffect(() => {
    setFilterProdi(prodiFromUrl);
    setTempFilterProdi(prodiFromUrl);
  }, [prodiFromUrl]);

  const handleApplyFilter = () => {
    setPage(1);
    setFilterStatus(tempFilterStatus);
    setFilterProdi(tempFilterProdi);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setSortBy(tempSortBy);
    setSearchQuery(tempSearchQuery);
  };

  const handleReset = () => {
    setPage(1);
    setFilterStatus('Semua');
    setFilterProdi('Semua');
    setStartDate('');
    setEndDate('');
    setSortBy('terbaru');
    setSearchQuery('');
    setTempFilterStatus('Semua');
    setTempFilterProdi('Semua');
    setTempStartDate('');
    setTempEndDate('');
    setTempSortBy('terbaru');
    setTempSearchQuery('');
  };

  const handleDownloadCertificate = () => {
    setShowSuccess(true);
  };

  const totalPages = Math.ceil(totalData / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalData);
  const paginatedData = allData;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setPage(1);
  };

  if (loading) return <Loading message="Memuat riwayat validasi..." />;

  return (
    <Stack spacing={3}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <FilterBar
          searchQuery={tempSearchQuery}
          onSearchChange={setTempSearchQuery}
          filterStatus={tempFilterStatus}
          onFilterChange={setTempFilterStatus}
          filterProdi={tempFilterProdi}
          onFilterProdiChange={setTempFilterProdi}
          startDate={tempStartDate}
          onStartDateChange={setTempStartDate}
          endDate={tempEndDate}
          onEndDateChange={setTempEndDate}
          sortBy={tempSortBy}
          onSortChange={setTempSortBy}
          onApplyFilter={handleApplyFilter}
          onReset={handleReset}
          isAdminView={true}
          jurusanList={jurusanList}
        />
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <DataInfo
          startIndex={startIndex}
          endIndex={endIndex}
          totalData={totalData}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        <HistoryList
          data={paginatedData}
          onDetail={(id) => navigate(`/admin/detail/${id}`)}
          onDownload={handleDownloadCertificate}
          isAdminView={true}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
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
