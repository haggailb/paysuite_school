
import { createContext, useContext, useState } from 'react';

const PageContext = createContext();

export const PageProvider = ({ children }) => {
  const [pageTitle, setPageTitle] = useState('');
  const [backUrl, setBackUrl] = useState('');

  return (
    <PageContext.Provider value={{ pageTitle, setPageTitle, backUrl, setBackUrl }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePage = () => useContext(PageContext);
