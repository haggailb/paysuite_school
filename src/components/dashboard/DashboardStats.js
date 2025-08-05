import React from 'react';
import '../styles/Navbar.css';
import formatCurrency from "../../_utils/formatCurrency";

const DashboardStats = () => {
  return (
    <div className="dashboard-stats">
      {/* Revenue Overview Card */}
      <div className="stat-card hoverable shadow bg-primary">
        <h3>{formatCurrency(67541, "ZMW", true)}</h3>
        <p>Total Revenue Today</p>
      </div>

      {/* Active Clients Overview */}
      <div className="stat-card hoverable shadow bg-primary">
        <h3>{formatCurrency(32115.13, "ZMW", true)}</h3>
        <p>Total Expenditure</p>
      </div>

      {/* Pending Payments */}
      <div className="stat-card hoverable shadow bg-alt">
        <h3>{formatCurrency(332300, "ZMW", true)}</h3>
        <p>Outstanding Payments</p>
      </div>

      {/* Licenses Overview */}
      <div className="stat-card hoverable shadow bg-alt">
        <h3>415</h3>
        <p>Pending License Invoices</p>
      </div>
    </div>

  );
};

export default DashboardStats;
