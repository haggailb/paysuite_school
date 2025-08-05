
import React, { useState, useEffect } from "react";
import DashboardStats from '../components/dashboard/DashboardStats';
import DashboardUpcoming from '../components/dashboard/DashboardUpcoming';
import ReceiptsAndPaymentsTrends from '../components/dashboard/ReceiptsAndPaymentsTrends';
import '../components/styles/Dashboard.css';
import DashboardRecent from "../components/dashboard/DashboardRecent";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem('PaySuiteUserData');
      if (storedUser && storedUser !== 'undefined') {
        return JSON.parse(storedUser);
      }
    } catch (err) {
      console.error('Error parsing stored user data:', err);
    }
    return null;
  });

  const navigate = useNavigate();

  
    useEffect(() => {
    if (!user) {
      navigate('/');
    }
    }, []);  //navigate
  

  return (
    <div  className="dashboard-main text-center">
      <h2 className="page-title">PaySuite Dashboard</h2>
      <h2>Major updates coming soon</h2>
      {/* <h4 className="sub-title">Trends</h4>
      <div className="trend-container">
        <ReceiptsAndPaymentsTrends />
        <ReceiptsAndPaymentsTrends />
        <ReceiptsAndPaymentsTrends />
      </div>
      
      <div className="stats-container">
        <h3>This Week Stats</h3>
        <DashboardStats />
      </div>

      <div className="upcoming-tasks">
        <h3>Upcoming Deadlines</h3>
        <DashboardUpcoming />
      </div>

      <div className="recent-activity">
        <h3>Recent Transactions</h3>
        <DashboardRecent />
      </div> */}

    </div>
  );
};

export default Dashboard;
