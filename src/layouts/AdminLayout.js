// AdminLayout.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { Outlet } from 'react-router-dom';
import { usePage } from '../layouts/pageContext';

const AdminLayout = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const { pageTitle, backUrl } = usePage(); 

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true); // Ensure sidebar is open on larger screens
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
  return (
    <div className={darkMode ? 'admin-layout dark' : 'admin-layout'}>
      <Sidebar isOpen={sidebarOpen || !isMobile} />
      <div className="main-content">
        <Topbar
          pageTitle={pageTitle}
          backUrl={backUrl}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          darkMode={darkMode}
        />
        <div className="content-wrapper">
          <Outlet />
        </div>
        {isMobile && (
          <button className="sidebar-toggle-fab" onClick={toggleSidebar}>
            ☰
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminLayout;