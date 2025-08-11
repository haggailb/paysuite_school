import React from 'react';
import { Link } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Topbar = ({pageTitle, backUrl,  toggleDarkMode, darkMode }) => {
  const navigate = useNavigate();
  return (
    <div className="custom-header d-flex justify-content-between align-items-center p-2 shadow">
      <Link to={'#'} className="back-button d-flex align-items-center" onClick={() => navigate(-1)}>
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
