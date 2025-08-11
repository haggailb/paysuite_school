
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
        <li><Link to="/"> <i className="bi bi-speedometer me-2"></i> Dashboard</Link></li>
        <li className={`dropdown ${activeDropdown === 'students' ? 'open' : ''}`}>
          <button className="dropdown-toggle" onClick={() => toggleDropdown('students')}>
            <FaUserGraduate className="me-2" />
            Students
          </button>
          <ul className="dropdown-menu">
            <li><Link to="/students"><i className="bi bi-person-lines-fill"></i> Student Register</Link></li>
            <li><Link to="/admissions"><i className="bi bi-person-plus"></i> Admissions</Link></li>
            <li><Link to="/retentions"><i className="bi bi-person-vcard"></i> Retentions</Link></li>
          </ul>
        </li>
        <li className={`dropdown ${activeDropdown === 'staff_members' ? 'open' : ''}`}>
          <button className="dropdown-toggle" onClick={() => toggleDropdown('staff_members')}>
            <FaChalkboardTeacher className="me-2" />
            Staff Members
          </button>
          <ul className="dropdown-menu">
            <li><Link to="/staff"><i className="bi bi-person-lines-fill"></i> Staff Register</Link></li>
            <li><Link to="/dean-allocation"><FaChalkboardTeacher /> Deans</Link></li>
            <li><Link to="/program-directors"><FaChalkboardTeacher /> Program Directors</Link></li>
            <li><Link to="/course-directors"><FaChalkboardTeacher /> Course Directors</Link></li>
          </ul>
        </li>
        <li className={`dropdown ${activeDropdown === 'finance' ? 'open' : ''}`}>
          <button className="dropdown-toggle" onClick={() => toggleDropdown('finance')}>
            <i className="bi bi-cash-coin me-2"></i>
            Finance
          </button>
          <ul className="dropdown-menu">
            <li><Link to="/dean-allocation"><i className="bi bi-receipt-cutoff"></i> New Receipt</Link></li>
          </ul>
        </li>
        
        <li className={`dropdown ${activeDropdown === 'exams' ? 'open' : ''}`}>
          <button className="dropdown-toggle" onClick={() => toggleDropdown('exams')}>
            <i className="bi bi-collection me-2"></i>
            Exams
          </button>
          <ul className="dropdown-menu">
            <li><Link to="/add-exam"><i className="bi bi-plus-lg"></i> Add Exam</Link></li>
            <li><Link to="/exams"><i className="bi bi-list-columns-reverse"></i> Manage Exams</Link></li>
          </ul>
        </li>

        <li className={`dropdown ${activeDropdown === 'reports' ? 'open' : ''}`}>
          <button className="dropdown-toggle" onClick={() => toggleDropdown('reports')}>
            <i className="bi bi-clipboard-data me-2"></i>
            Reports
          </button>
          <ul className="dropdown-menu">
            <li><Link to="/exam-results"><i className="bi bi-file-earmark-ruled"></i> Exam Results</Link></li>
            <li><Link to="/receipts"><i className="bi bi-file-earmark-ruled"></i> Receipts Ledger</Link></li>
            <li><Link to="/receipts-summary"><i className="bi bi-file-earmark-ruled"></i> Receipts Summary</Link></li>
            <li><Link to="/payments"><i className="bi bi-file-earmark-ruled"></i> Payments Ledger</Link></li>
            <li><Link to="/payments-summary"><i className="bi bi-file-earmark-ruled"></i> Payments Summary</Link></li>
            <li><Link to="/receipts-payaments"><i className="bi bi-file-earmark-ruled"></i> Receipts and Payments</Link></li>
            <li><Link to="/cashbooks"><i className="bi bi-file-earmark-ruled"></i> Cashbooks</Link></li>
            <li><Link to="/chart-of-accounts"><i className="bi bi-list-ol"></i> Chart of Accounts</Link></li>
          </ul>
        </li>

        <li className={`dropdown ${activeDropdown === 'media' ? 'open' : ''}`}>
          <button className="dropdown-toggle" onClick={() => toggleDropdown('media')}>
            <i className="bi bi-collection me-2"></i>
            Media
          </button>
          <ul className="dropdown-menu">
            <li><Link to="/bulk-messaging"><i className="bi bi-chat-dots"></i> Builk Messaging</Link></li>
            <li><Link to="/reminders"><i className="bi bi-bell"></i> Reminders</Link></li>
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
            <li><Link to="/program-structures/outline"><i className="bi bi-journal-text"></i> Program Outlines </Link></li>
            <li><Link to="/bank-accounts"><i className="bi bi-bank"></i> Bank Accounts</Link></li>
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

        <li className={`dropdown ${activeDropdown === 'settings' ? 'open' : ''}`}>
          <button className="dropdown-toggle" onClick={() => toggleDropdown('settings')}>
            <i className="bi bi-gear-wide-connected me-2"></i> Settings
          </button>
          <ul className="dropdown-menu">
            <li><Link to="/numbering-system"><i className="bi bi-list-ol me-2"></i>Numbering Sysytem</Link></li>
            <li><Link to="/student-thresholds"><FaUserLock /> Student Threasholds</Link></li>
          </ul>
        </li>
      </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
