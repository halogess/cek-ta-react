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
  MenuBookOutlined,
  DeleteOutlined,
} from '@mui/icons-material';

// Menu untuk mahasiswa
export const mahasiswaMenuItems = [
  { text: 'Dashboard', icon: React.createElement(HomeOutlined), path: '/mahasiswa' },
  { text: 'Cek Dokumen', icon: React.createElement(UploadOutlined), path: '/mahasiswa/dokumen' },
  { text: 'Validasi Buku Lengkap', icon: React.createElement(MenuBookOutlined), path: '/mahasiswa/buku' },
  { text: 'Template & Panduan', icon: React.createElement(DescriptionOutlined), path: '/mahasiswa/template' },
];

// Menu untuk admin
export const adminMenuItems = [
  { text: 'Dashboard', icon: React.createElement(HomeOutlined), path: '/admin' },
  { text: 'Template Panduan', icon: React.createElement(DescriptionOutlined), path: '/admin/template' },
  { text: 'Riwayat Validasi Buku', icon: React.createElement(HistoryOutlined), path: '/admin/history' },
  { text: 'Hapus Riwayat Validasi', icon: React.createElement(DeleteOutlined), path: '/admin/hapus-riwayat' },
];
