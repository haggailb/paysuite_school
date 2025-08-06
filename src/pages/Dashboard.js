import React from 'react';
import '../styles/Dashboard.css'; // Assuming you have a CSS file for styling
import { FaUserGraduate, FaChalkboardTeacher, FaSchool, FaCalendarAlt, FaClock } from 'react-icons/fa';
// import enrollmentChart from '../assets/enrollment_chart.png'; // replace with actual chart image or use Chart.js later

const Dashboard = () => {
  // Sample data (can be fetched from backend later)
  const stats = {
    students: 512,
    teachers: 38,
    classes: 24,
    session: '2025',
    term: 'Term 2',
  };

  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>

      <div className="card-grid">
        <div className="card stat-card">
          <FaUserGraduate className="card-icon" />
          <div>
            <h4>{stats.students}</h4>
            <p>Students</p>
          </div>
        </div>

        <div className="card stat-card">
          <FaChalkboardTeacher className="card-icon" />
          <div>
            <h4>{stats.teachers}</h4>
            <p>Teachers / Tutors</p>
          </div>
        </div>

        <div className="card stat-card">
          <FaSchool className="card-icon" />
          <div>
            <h4>{stats.classes}</h4>
            <p>Classes</p>
          </div>
        </div>

        <div className="card stat-card">
          <FaCalendarAlt className="card-icon" />
          <div>
            <h4>{stats.session}</h4>
            <p>Current Session</p>
          </div>
        </div>

        <div className="card stat-card">
          <FaClock className="card-icon" />
          <div>
            <h4>{stats.term}</h4>
            <p>Current Term</p>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <h3>Enrollment Growth</h3>
        {/* <img src={enrollmentChart} alt="Enrollment Chart" className="chart-img" /> */}
      </div>
    </div>
  );
};

export default Dashboard;
