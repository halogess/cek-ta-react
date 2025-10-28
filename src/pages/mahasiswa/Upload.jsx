import React, { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import { useHeader } from '../../context/HeaderContext';
import { useSelector } from 'react-redux';
import UploadFormCard from '../../components/mahasiswa/upload/UploadFormCard';
import UploadInfoCard from '../../components/mahasiswa/upload/UploadInfoCard';
import { validationService } from '../../services';


export default function Upload() {
  const { setHeaderInfo } = useHeader();
  const { user } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const [hasQueuedDoc, setHasQueuedDoc] = useState(false);

  useEffect(() => {
    const checkQueuedDoc = async () => {
      try {
        const data = await validationService.getValidationsByUser(user);
        setHasQueuedDoc(data.some(v => v.status === 'Dalam Antrian' || v.status === 'Diproses'));
      } catch (error) {
        console.error('Error checking queued doc:', error);
      }
    };
    if (user) checkQueuedDoc();
  }, [user]);

  // Mengatur judul header saat komponen dimuat
  useEffect(() => {
    setHeaderInfo({
      title: 'Unggah Dokumen',
      subtitle: 'Validasi dokumen tugas akhir atau tesis Anda',
    });
    return () => {
      setHeaderInfo({ title: '', subtitle: '' });
    };
  }, [setHeaderInfo]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const isButtonDisabled = !file || !isConfirmed || hasQueuedDoc;

  const handleUpload = () => {
    // Simulate upload process
    setUploadSuccess(true);
  };

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