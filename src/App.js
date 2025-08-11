import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import StaffMembers from './pages/StaffMembers';
import Students from './pages/Students';
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
import ProgramCourseStructures from './pages/ProgramCourseStructures';
import ProgramOutlininng from './pages/ProgramOutline';
import AccessLevels from './pages/AccessLevels';
import Users from './pages/Users';
import DeanAllocation from './pages/DeanAllocation';
import ProgramDirectors from './pages/ProgramDirectors';
import CourseDirectors from './pages/CourseDirectors';
import NumberingSystem from './pages/NumberingSystem';
import StudentThresholds from './pages/StudentThresholds';
import ExamList from './pages/ExamList';
import ExamSchedule from './pages/ExamSchedule';
import AddExam from './pages/AddExam';
import ExamPapers from './pages/ExamPapers';
import ExamPaperMarking from './pages/ExamPaperMarking';
import Admissions from './pages/Admissions';
import EditLevelDetails from './pages/EditLevelDetails';
import EditLevelCourses from './pages/EditLevelCourses';
import EditLevelFees from './pages/EditLevelFees';
import StudentAdmission from './pages/StudentAdmission';
import Retentions from './pages/Retentions';
import StudentRetention from './pages/StudentRetention';

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
          <Route path="admissions" element={<Admissions />} />
          <Route path="retentions" element={<Retentions />} />
          <Route path="admissions/:studentId" element={<StudentAdmission />} />
          <Route path="retentions/:studentId" element={<StudentRetention />} />
          <Route path="guardians" element={<Guardians />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="payments" element={<Payments />} />
          <Route path="faculties" element={<Faculties />} />
          <Route path="programs" element={<Programs />} />
          <Route path="program-structures/outline" element={<ProgramCourseStructures />} />
          <Route path="programs/:programCode/outline" element={<ProgramOutlininng/>} />
          <Route path="programs/:programCode/outline/edit/:levelCode" element={<EditLevelDetails/>} />
          <Route path="programs/:programCode/outline/courses/:levelCode" element={<EditLevelCourses/>} />
          <Route path="programs/:programCode/outline/fees/:levelCode" element={<EditLevelFees/>} />
          <Route path="courses" element={<Courses />} />
          <Route path="results" element={<Results />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="access-levels" element={<AccessLevels />} />
          <Route path="system-users" element={<Users />} />
          <Route path="dean-allocation" element={<DeanAllocation />} />
          <Route path="program-directors" element={<ProgramDirectors />} />
          <Route path="course-directors" element={<CourseDirectors />} />
          <Route path="numbering-system" element={<NumberingSystem />} />
          <Route path="student-thresholds" element={<StudentThresholds />} />
          <Route path="add-exam" element={<AddExam />} />
          <Route path="exams" element={<ExamList />} />
          <Route path="exam-schedule/:examCode" element={<ExamSchedule />} />
          <Route path="exam-papers/:examCode" element={<ExamPapers />} />
          <Route path="exams/:examCode/:courseCode/marking" element={<ExamPaperMarking />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
