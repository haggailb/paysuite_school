import React from 'react';
import '../styles/Navbar.css';
import {FaExclamationCircle } from "react-icons/fa";


const DashboardUpcoming = () => {
  return (
    <div className="upcoming-tasks">
      <ul>
        <li><FaExclamationCircle /> License Renewals - Due in 3 days</li>
        <li><FaExclamationCircle /> Pending Payments - 2 invoices overdue</li>
      </ul>
    </div>
  );
};

export default DashboardUpcoming;
