
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import {
  FaTachometerAlt, FaUserGraduate, FaChalkboardTeacher, FaSchool,
  FaUsers, FaFileInvoice, FaMoneyCheckAlt, FaBook,
  FaClipboardList, FaCogs, FaChartPie, FaChevronDown 
} from 'react-icons/fa';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card } from "react-bootstrap";
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <h2 className="logo text-white">PaySuite ERP</h2>
      <nav>
      <ul className="sidebar-menu">
        <li><Link to="/"> <FaTachometerAlt className="me-2" /> Dashboard</Link></li>
        <li><Link to="/staff"> <FaChalkboardTeacher className="me-2" /> Staff Members</Link></li>
        <li><Link to="/students"> <FaUserGraduate className="me-2" /> Students</Link></li>
        <li><Link to="/invoices"> <FaFileInvoice className="me-2" /> Invoices</Link></li>
        <li><Link to="/payments"> <FaMoneyCheckAlt className="me-2" /> Payments</Link></li>
        <li><Link to="/results"> <FaClipboardList className="me-2" /> Results</Link></li>
        <li><Link to="/reports"> <FaClipboardList className="me-2" /> Reports</Link></li>
        <li><Link to="/settings"> <FaCogs className="me-2" /> Settings</Link></li>
        <li><Link to="/users"> <FaCogs className="me-2" /> User Management</Link></li>
        <li className="dropdown">
          <button
            className="dropdown-toggle"
            onClick={() => setShowConfig(!showConfig)}
          >
            <FaBook className="me-2" />
            Configurations
            <FaChevronDown className={`chevron ${showConfig ? 'rotate' : ''}`} />
          </button>

          {showConfig && (
            <ul className="dropdown-menu">
              <li>
                <Link to="/faculties">
                  <FaBook className="me-2" />
                  Faculties / Schools
                </Link>
              </li>
              <li>
                <Link to="/programs">
                  <FaBook className="me-2" />
                  Programs
                </Link>
              </li>
              <li>
                <Link to="/courses">
                  <FaBook className="me-2" />
                  Courses / Subjects
                </Link>
              </li>
            </ul>
          )}
        </li>

      </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
