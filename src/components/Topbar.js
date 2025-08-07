import React from 'react';
import { Link } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';

const Topbar = ({pageTitle, backUrl,  toggleDarkMode, darkMode }) => {
  return (
    <div className="custom-header d-flex justify-content-between align-items-center">
      <Link to={backUrl} className="back-button d-flex align-items-center">
        <i className="bi bi-arrow-left-circle me-2"></i> Back
      </Link>
      <span>{pageTitle}</span>
      <button className="theme-toggle" onClick={toggleDarkMode}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>
    </div>
  );
};

export default Topbar;
