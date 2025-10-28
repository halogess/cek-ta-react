/**
 * Upload Page - Halaman untuk upload dokumen validasi
 * Menampilkan:
 * - Form upload dengan file picker
 * - Checkbox konfirmasi
 * - Info tentang format dan ukuran file
 * - Validasi: tidak bisa upload jika ada dokumen dalam antrian
 */

import React, { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import { useHeader } from '../../context/HeaderContext';
import { useSelector } from 'react-redux';
import UploadFormCard from '../../components/mahasiswa/upload/UploadFormCard';
import UploadInfoCard from '../../components/mahasiswa/upload/UploadInfoCard';
import Loading from '../../components/shared/ui/Loading';
import { validationService } from '../../services';

export default function Upload() {
  const { setHeaderInfo } = useHeader();
  const { user } = useSelector((state) => state.user);
  
  // State untuk form
  const [file, setFile] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [hasQueuedDoc, setHasQueuedDoc] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check apakah user punya dokumen dalam antrian/diproses
  useEffect(() => {
    const checkQueuedDoc = async () => {
      try {
        setLoading(true);
        const data = await validationService.getValidationsByUser(user);
        setHasQueuedDoc(data.some(v => v.status === 'Dalam Antrian' || v.status === 'Diproses'));
      } catch (error) {
        console.error('Error checking queued doc:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) checkQueuedDoc();
  }, [user]);

  // Set header title saat mount
  useEffect(() => {
    setHeaderInfo({
      title: 'Unggah Dokumen',
      subtitle: 'Validasi dokumen tugas akhir atau tesis Anda',
    });
    return () => {
      setHeaderInfo({ title: '', subtitle: '' });
    };
  }, [setHeaderInfo]);

  // Handler untuk file change
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  // Disable button jika: tidak ada file, belum confirm, atau ada dokumen dalam antrian
  const isButtonDisabled = !file || !isConfirmed || hasQueuedDoc;

  // Handler untuk upload
  const handleUpload = () => {
    setUploadSuccess(true);
  };

  if (loading) return <Loading message="Memuat halaman upload..." />;

  return (
    <Stack spacing={4}>
      <UploadFormCard
        file={file}
        onFileChange={handleFileChange}
        isConfirmed={isConfirmed}
        onConfirmChange={setIsConfirmed}
        onUpload={handleUpload}
        isDisabled={isButtonDisabled}
        hasQueuedDoc={hasQueuedDoc}
        uploadSuccess={uploadSuccess}
      />
      <UploadInfoCard />
    </Stack>
  );
}