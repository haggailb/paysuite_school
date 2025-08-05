import React from 'react';
import '../styles/Navbar.css';
import {FaExclamationCircle } from "react-icons/fa";


const DashboardRecent = () => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Comment</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>Property Rates</td>
            <td>K 500</td>
            <td>L/1052/M/1212</td>
            <td>Verified ✔️</td>
            <td>March 2, 2025</td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>Business Levy</td>
            <td>K 4,750</td>
            <td>2025 Business Levy</td>
            <td>Pending</td>
            <td>March 1, 2025</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DashboardRecent;
