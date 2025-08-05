import React from 'react';
import './styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar  bg-primary">
      <div className="navbar-left">
        <img
            src="images/logo-bg.png"
            alt="Logo"
            className="logo"
          />
      </div>
      <div className="user-profile">
        <span>Fast. Secure. Reliable.</span>
      </div>
    </nav>
  );
};

export default Navbar;
