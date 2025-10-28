/**
 * Header Context - Mengelola state judul header secara global
 * Digunakan oleh halaman-halaman untuk mengupdate judul header dinamis
 * tanpa prop drilling
 */

import { createContext, useState, useContext } from 'react';

// Buat context untuk header
const HeaderContext = createContext();

/**
 * Provider component untuk membungkus aplikasi
 * Menyediakan state headerInfo dan setter ke semua child components
 */
export const HeaderProvider = ({ children }) => {
  // State untuk menyimpan info header (title, dll)
  const [headerInfo, setHeaderInfo] = useState({ title: '' });

  return (
    <HeaderContext.Provider value={{ headerInfo, setHeaderInfo }}>
      {children}
    </HeaderContext.Provider>
  );
};

/**
 * Custom hook untuk mengakses header context
 * Digunakan di halaman: setHeaderInfo({ title: 'Judul Halaman' })
 */
export const useHeader = () => useContext(HeaderContext);