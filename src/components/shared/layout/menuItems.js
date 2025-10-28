/**
 * Menu Items Configuration
 * Konfigurasi menu sidebar untuk mahasiswa dan admin
 * Setiap item memiliki text, icon, dan path
 */

import React from 'react';
import {
  HomeOutlined,
  UploadOutlined,
  HistoryOutlined,
  DescriptionOutlined,
} from '@mui/icons-material';

// Menu untuk mahasiswa
export const mahasiswaMenuItems = [
  { text: 'Dashboard', icon: React.createElement(HomeOutlined), path: '/mahasiswa' },
  { text: 'Unggah Dokumen', icon: React.createElement(UploadOutlined), path: '/mahasiswa/upload' },
  { text: 'Template & Panduan', icon: React.createElement(DescriptionOutlined), path: '/mahasiswa/template' },
  { text: 'Riwayat', icon: React.createElement(HistoryOutlined), path: '/mahasiswa/history' },
];

// Menu untuk admin
export const adminMenuItems = [
  { text: 'Dashboard', icon: React.createElement(HomeOutlined), path: '/admin' },
  { text: 'Template Panduan', icon: React.createElement(DescriptionOutlined), path: '/admin/template' },
  { text: 'Riwayat Validasi', icon: React.createElement(HistoryOutlined), path: '/admin/history' },
];
