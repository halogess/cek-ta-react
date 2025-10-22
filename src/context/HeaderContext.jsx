// src/context/HeaderContext.jsx

import 
{
  createContext,
  useState,
  useContext
} from 'react';

// Buat context
const HeaderContext = createContext();

// Buat Provider component
export const HeaderProvider = ({ children }) => {
  const [headerInfo, setHeaderInfo] = useState({ title: '' });

  return (
    <HeaderContext.Provider value={{ headerInfo, setHeaderInfo }}>
      {children}
    </HeaderContext.Provider>
  );
};

// Buat custom hook untuk kemudahan penggunaan
export const useHeader = () => useContext(HeaderContext);