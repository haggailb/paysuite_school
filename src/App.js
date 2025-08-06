
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Staff from './pages/Staff';
import Students from './pages/Students';
import Classes from './pages/Classes';
import Guardians from './pages/Guardians';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';
import Courses from './pages/Courses';
import Results from './pages/Results';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './styles/theme.css';
import './styles/global.css';
import Faculties from './pages/Faculties';
import Programs from './pages/Programs';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<AdminLayout />}> 
          <Route index element={<Dashboard />} />
          <Route path="staff" element={<Staff />} />
          <Route path="students" element={<Students />} />
          <Route path="classes" element={<Classes />} />
          <Route path="guardians" element={<Guardians />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="payments" element={<Payments />} />
          <Route path="faculties" element={<Faculties />} />
          <Route path="programs" element={<Programs />} />
          <Route path="courses" element={<Courses />} />
          <Route path="results" element={<Results />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;