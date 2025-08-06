import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

const Topbar = ({ toggleDarkMode, darkMode }) => {
  return (
    <div className="topbar">
      <span>Name of School</span>
      <button className="theme-toggle" onClick={toggleDarkMode}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>
    </div>
  );
};

export default Topbar;
