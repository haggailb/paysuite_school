import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../../components/styles/Login.css';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

const UnauthorizedAccess = () => {
    
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title text-white">Unauthorized Access to protected route</h2>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
