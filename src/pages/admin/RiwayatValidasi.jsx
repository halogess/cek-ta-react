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
  }, [filterStatus, filterProdi, startDate, endDate, sortBy, searchQuery]);



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
      
      backendParams.sort = sortBy === 'terlama' ? 'asc' : 'desc';
      backendParams.limit = 1000;
      
      console.log('📋 Fetching buku with params:', backendParams);
      const result = await validationService.getAllBookValidations(backendParams);
      console.log('📋 Buku result:', result);
      
      let transformedData = (result.data || []).map(item => ({
        id: item.id,
        filename: `BK-${item.id}`,
        judulBuku: item.judul,
        date: item.tanggal_upload,
        numChapters: item.jumlah_bab,
        status: item.status === 'dalam_antrian' ? 'Dalam Antrian' : 
                item.status === 'diproses' ? 'Diproses' :
                item.status === 'lolos' ? 'Lolos' :
                item.status === 'tidak_lolos' ? 'Tidak Lolos' : 'Dibatalkan',
        errorCount: item.jumlah_kesalahan,
        skor: item.skor,
        nrp: item.nrp,
        nama: item.nama,
        jurusan: item.jurusan
      }));
      
      if (filterProdi !== 'Semua') {
        transformedData = transformedData.filter(item => item.jurusan === filterProdi);
      }
      
      if (searchQuery) {
        transformedData = transformedData.filter(item => 
          item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.nrp?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (startDate) {
        transformedData = transformedData.filter(item => 
          new Date(item.date) >= new Date(startDate)
        );
      }
      
      if (endDate) {
        transformedData = transformedData.filter(item => 
          new Date(item.date) <= new Date(endDate + 'T23:59:59')
        );
      }
      
      console.log('📋 Transformed data:', transformedData);
      setAllData(transformedData);
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
    setFilterStatus(tempFilterStatus);
    setFilterProdi(tempFilterProdi);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setSortBy(tempSortBy);
    setSearchQuery(tempSearchQuery);
    setPage(1);
  };

  const handleReset = () => {
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
    setPage(1);
  };

  const handleDownloadCertificate = () => {
    setShowSuccess(true);
  };

  const totalPages = Math.ceil(allData.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = allData.slice(startIndex, endIndex);

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
          totalData={allData.length}
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
