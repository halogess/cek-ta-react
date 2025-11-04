import { Paper, Typography, Box } from '@mui/material';

const StatCard = ({ title, value, subtitle, icon, iconColor, action, onClick, isTotal = false }) => (
  <Paper
    elevation={0}
    onClick={onClick}
    sx={{
      p: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'relative',
      borderRadius: '16px',
      border: 'none',
      bgcolor: `${iconColor}18`,
      height: '100%',
      minHeight: '75px',
      width: '100%',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s',
      '&:hover': onClick ? {
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transform: 'translateY(-2px)'
      } : {}
    }}
  >
    <Box 
      sx={{ 
        position: 'absolute',
        top: 10,
        right: 10,
        width: 24,
        height: 24,
        borderRadius: '6px',
        bgcolor: iconColor,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiSvgIcon-root': { fontSize: '14px' }
      }}
    >
      {icon}
    </Box>
    
    {isTotal ? (
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 0.75, width: '100%', pr: 3.5 }}>
        <Box 
          sx={{ 
            width: 34,
            height: 34,
            borderRadius: '50%',
            bgcolor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '0.95rem' }}>{value}</Typography>
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" fontWeight="600" sx={{ color: '#1F2937', lineHeight: 1, mb: 0, wordBreak: 'break-word' }}>{title}</Typography>
          <Typography variant="caption" sx={{ color: iconColor, fontWeight: 500, lineHeight: 1, fontSize: '0.68rem', wordBreak: 'break-word' }}>{subtitle}</Typography>
        </Box>
      </Box>
    ) : (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, pr: 3.5, width: '100%' }}>
        <Box 
          sx={{ 
            width: 34,
            height: 34,
            borderRadius: '50%',
            bgcolor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '0.95rem' }}>{value}</Typography>
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" fontWeight="600" sx={{ color: '#1F2937', wordBreak: 'break-word', lineHeight: 1, mb: 0 }}>{title}</Typography>
          <Typography variant="caption" sx={{ color: iconColor, fontWeight: 500, wordBreak: 'break-word', lineHeight: 1, fontSize: '0.68rem' }}>{subtitle}</Typography>
        </Box>
      </Box>
    )}
    {action}
  </Paper>
);

export default StatCard;