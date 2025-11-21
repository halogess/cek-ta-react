import { Paper, Box, Stack, Typography, Button, Tooltip } from '@mui/material';
import { FileCopyOutlined, CheckCircleOutline, WarningAmberOutlined, HourglassEmptyOutlined, BlockOutlined, Add, ArrowForward, DescriptionOutlined, MenuBookOutlined, FiberManualRecordOutlined } from '@mui/icons-material';
import StatCard from '../../shared/ui/StatCard';
import DashboardHistoryList from './DashboardHistoryList';

export default function StatsCards({ type, stats, historyData, hasQueued, onCancel, onDetail, onDownload, onViewMore, onCreate, onNavigate }) {
  const isDokumen = type === 'dokumen';
  
  const config = {
    dokumen: {
      title: 'Cek Dokumen',
      icon: <DescriptionOutlined sx={{ fontSize: 28 }} />,
      iconColor: '#1E40AF',
      buttonText: 'Cek Dokumen Baru'
    },
    buku: {
      title: 'Validasi Buku Lengkap',
      icon: <MenuBookOutlined sx={{ fontSize: 28 }} />,
      iconColor: '#1E40AF',
      buttonText: 'Validasi Buku Baru'
    }
  };

  return {
    title: <Typography variant="h5" fontWeight="bold">{config[type].title}</Typography>,
    
    stats: (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 3fr)' }, gap: 1.5, minWidth: 0 }}>
        <Box sx={{ display: { xs: 'contents', md: 'block' }, minWidth: 0 }}>
          <StatCard 
            title={isDokumen ? 'Dokumen' : 'Buku'}
            value={stats.total.toString()} 
            subtitle="Telah diupload untuk validasi"
            icon={<FileCopyOutlined />} 
            iconColor="#9333EA"
            onClick={() => onNavigate('Semua')}
            isTotal
          />
        </Box>
        <Box sx={{ display: { xs: 'contents', md: 'grid' }, gridTemplateColumns: { md: 'repeat(2, 1fr)' }, gap: 1.5, minWidth: 0 }}>
          <StatCard 
            title="Menunggu" 
            value={stats.waiting.toString()} 
            subtitle="Sedang diproses" 
            icon={<HourglassEmptyOutlined />} 
            iconColor="#2563EB"
            onClick={() => onNavigate('Menunggu')}
          />
          <StatCard 
            title="Lolos" 
            value={stats.passed.toString()} 
            subtitle="Memenuhi standar" 
            icon={<CheckCircleOutline />} 
            iconColor="#059669"
            onClick={() => onNavigate('Lolos')}
          />
          <StatCard 
            title="Tidak Lolos" 
            value={stats.needsFix.toString()} 
            subtitle="Perlu diperbaiki" 
            icon={<WarningAmberOutlined />} 
            iconColor="#DC2626"
            onClick={() => onNavigate('Tidak Lolos')}
          />
          <StatCard 
            title="Dibatalkan" 
            value={stats.cancelled.toString()} 
            subtitle="Validasi dibatalkan" 
            icon={<BlockOutlined />} 
            iconColor="#6B7280"
            onClick={() => onNavigate('Dibatalkan')}
          />
        </Box>
      </Box>
    ),
    
    info: (
      <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { xs: 'stretch', md: 'center' }, minWidth: 0 }}>
        <Stack spacing={1.5} sx={{ flex: 1 }}>
          {isDokumen ? (
            <>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: config[type].iconColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>1</Box>
                <Typography variant="body2" color="text.secondary" sx={{ pt: 0.5 }}>Validasi dokumen <strong>per BAB</strong> secara terpisah</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: config[type].iconColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>2</Box>
                <Typography variant="body2" color="text.secondary" sx={{ pt: 0.5 }}>Upload <strong>satu file .docx</strong> per validasi</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: config[type].iconColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>3</Box>
                <Typography variant="body2" color="text.secondary" sx={{ pt: 0.5 }}>Cocok untuk <strong>cek format cepat</strong> sebelum digabung</Typography>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: config[type].iconColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>1</Box>
                <Typography variant="body2" color="text.secondary" sx={{ pt: 0.5 }}>Validasi <strong>semua file buku TA</strong> sekaligus</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: config[type].iconColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>2</Box>
                <Typography variant="body2" color="text.secondary" sx={{ pt: 0.5 }}>Upload <strong>Cover, BAB, Daftar Pustaka</strong> bersamaan</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: config[type].iconColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>3</Box>
                <Typography variant="body2" color="text.secondary" sx={{ pt: 0.5 }}>Dapatkan <strong>skor keseluruhan</strong> buku TA Anda</Typography>
              </Box>
            </>
          )}
        </Stack>

        <Tooltip 
          title={hasQueued ? `Anda memiliki ${isDokumen ? 'dokumen' : 'buku'} dalam antrian` : ''}
          arrow
          placement="top"
        >
          <span style={{ display: 'flex', minWidth: 0 }}>
            <Button 
              variant="contained" 
              onClick={onCreate}
              disabled={hasQueued}
              fullWidth
              sx={{ 
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)',
                  boxShadow: '0 6px 20px rgba(59, 130, 246, 0.5)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #E5E7EB, #D1D5DB)',
                  color: '#9CA3AF',
                  boxShadow: 'none'
                },
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                py: 2.5,
                px: { xs: 2, md: 3 },
                minWidth: { xs: 0, md: 150 },
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
            >
              <Box sx={{ 
                width: 56, 
                height: 56, 
                borderRadius: '50%', 
                bgcolor: 'rgba(255,255,255,0.2)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 0.5
              }}>
                <Add sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Typography variant="button" fontWeight="bold" textAlign="center" sx={{ fontSize: '0.75rem', lineHeight: 1.3 }}>
                {config[type].buttonText}
              </Typography>
            </Button>
          </span>
        </Tooltip>
      </Paper>
    ),
    
    history: historyData.length > 0 ? (
      <Stack spacing={2}>
        <DashboardHistoryList
          data={historyData}
          onDetail={onDetail}
          onDownload={onDownload}
          onCancel={onCancel}
        />
        <Button 
          endIcon={<ArrowForward />}
          onClick={onViewMore}
          size="small"
          fullWidth
          variant="outlined"
        >
          Lihat Selengkapnya
        </Button>
      </Stack>
    ) : (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">Belum ada riwayat {isDokumen ? 'cek dokumen' : 'validasi buku'}</Typography>
      </Box>
    )
  };
}
