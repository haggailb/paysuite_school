import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import StaffMembers from './pages/StaffMembers';
import Students from './pages/Students';
import Classes from './pages/Classes';
import Guardians from './pages/Guardians';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';
import Courses from './pages/Courses';
import Results from './pages/Results';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Faculties from './pages/Faculties';
import Programs from './pages/Programs';
import { PageProvider } from './layouts/pageContext';
import ProgramStructures from './pages/ProgramStructures';
import ProgramStructuring from './pages/ProgramStructuring';
import AccessLevels from './pages/AccessLevels';
import Users from './pages/Users';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/*"
          element={
            <PageProvider>
              <AdminLayout />
            </PageProvider>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="staff" element={<StaffMembers />} />
          <Route path="students" element={<Students />} />
          <Route path="classes" element={<Classes />} />
          <Route path="guardians" element={<Guardians />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="payments" element={<Payments />} />
          <Route path="faculties" element={<Faculties />} />
          <Route path="programs" element={<Programs />} />
          <Route path="program-structures" element={<ProgramStructures />} />
          <Route path="programs/:programCode/structure" element={<ProgramStructuring/>} />
          <Route path="courses" element={<Courses />} />
          <Route path="results" element={<Results />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="access-levels" element={<AccessLevels />} />
          <Route path="system-users" element={<Users />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
