
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import {
  FaTachometerAlt, FaUserGraduate, FaChalkboardTeacher, FaSchool,
  FaUsers, FaFileInvoice, FaMoneyCheckAlt, FaBook,
  FaClipboardList, FaCogs, FaChartPie, FaChevronDown, 
  FaGraduationCap,
  FaUserTag,
  FaUserLock
} from 'react-icons/fa';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card } from "react-bootstrap";
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const [showConfig, setShowConfig] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showUsersMenu, setShowUsersMenu] = useState(false);
  const [showAssignMenu, setShowAssignMenu] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setActiveDropdown(prev => (prev === menu ? null : menu));
  };


  return (
    <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <h2 className="logo text-white">PaySuite ERP</h2>
      <nav>
      <ul className="sidebar-menu">
        <li><Link to="/"> <i class="bi bi-speedometer me-2"></i> Dashboard</Link></li>
        <li><Link to="/staff"> <FaChalkboardTeacher className="me-2" /> Staff Members</Link></li>
        <li><Link to="/students"> <FaUserGraduate className="me-2" /> Student Register</Link></li>
        <li><Link to="/invoices"> <i class="bi bi-file-earmark-ruled me-2"></i> Invoices</Link></li>
        <li><Link to="/payments"> <i class="bi bi-credit-card-2-back me-2"></i> Payments</Link></li>
        <li className={`dropdown ${activeDropdown === 'reports' ? 'open' : ''}`}>
          <button className="dropdown-toggle" onClick={() => toggleDropdown('reports')}>
            <i className="bi bi-clipboard-data me-2"></i>
            Reports
          </button>
          <ul className="dropdown-menu">
            <li><Link to="/student-results"><i className="bi bi-bar-chart-line"></i> Student Results</Link></li>
          </ul>
        </li>

        <li className={`dropdown ${activeDropdown === 'config' ? 'open' : ''}`}>
          <button className="dropdown-toggle" onClick={() => toggleDropdown('config')}>
            <i className="bi bi-sliders me-2"></i>
            Configurations
          </button>
          <ul className="dropdown-menu">
            <li><Link to="/faculties"><i className="bi bi-buildings"></i> Faculties / Schools</Link></li>
            <li><Link to="/programs"><i className="bi bi-mortarboard"></i> Programs</Link></li>
            <li><Link to="/courses"><i className="bi bi-journal-text"></i> Courses / Subjects</Link></li>
            <li><Link to="/program-structures"><i className="bi bi-journal-text"></i> Program Structures </Link></li>
          </ul>
        </li>

        <li className={`dropdown ${activeDropdown === 'assign' ? 'open' : ''}`}>
          <button className="dropdown-toggle" onClick={() => toggleDropdown('assign')}>
            <i className="bi bi-person-fill-add me-2"></i>
            Staff Assignments
          </button>
          <ul className="dropdown-menu">
            <li><Link to="/deans"><FaChalkboardTeacher /> Deans</Link></li>
            <li><Link to="/program-directors"><FaChalkboardTeacher /> Program Directors</Link></li>
            <li><Link to="/courses-director"><FaChalkboardTeacher /> Courses Directors</Link></li>
          </ul>
        </li>

        <li className={`dropdown ${activeDropdown === 'users' ? 'open' : ''}`}>
          <button className="dropdown-toggle" onClick={() => toggleDropdown('users')}>
            <i className="bi bi-person-gear me-2"></i>
            User Management
          </button>
          <ul className="dropdown-menu">
            <li><Link to="/access-levels"><FaUserTag /> Access Levels</Link></li>
            <li><Link to="/system-users"><FaUserLock /> System Users</Link></li>
          </ul>
        </li>

        <li><Link to="/settings"> <i class="bi bi-gear-wide-connected me-2"></i> Settings</Link></li>

      </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
