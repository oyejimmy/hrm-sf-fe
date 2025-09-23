import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { queryClient } from './lib/react-query';
import { GlobalStyles } from './styles/global-styles';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import { AuthProvider } from './contexts/AuthContext';
import { PageLoader } from './components/common/PageLoader';
import './styles/responsive.css';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import RoleBasedRedirect from './features/auth/RoleBasedRedirect';

// Layout Components
import { AdminLayout } from './components/Layout/AdminLayout';
import { EmployeeLayout } from './components/Layout/EmployeeLayout';
import { TeamLeadLayout } from './components/Layout/TeamLeadLayout';

// Auth Components
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';

// Admin Components
import AdminDashboard from './features/admin/AdminDashboard';
import EmployeeManagement from './features/admin/EmployeeManagement';
import AttendanceAndLeave from './features/admin/AttendanceAndLeave';
import ReportsAnalytics from './features/admin/ReportsAnalytics';
import Recruitments from './features/admin/Recruitments';
import PerformanceManagement from './features/admin/PerformanceManagement';
import DocumentManagement from './features/admin/DocumentManagement';
import CommunicationAndNotification from './features/admin/CommunicationAndNotification';
import TrainingManagement from './features/admin/TrainingManagement';
import NotificationManagement from './features/admin/NotificationManagement';

// Employee Components
import EmployeeDashboard from './features/employee/EmployeeDashboard';
import Attendance from './features/employee/EmployeeAttendance';
import LeaveManagement from './features/employee/EmployeeLeaveManagement';
import TrainingAndDevelopment from './features/employee/EmployeeTrainingDevelopment';
import Payslip from './features/employee/EmployeePayslip';
import Assets from './features/employee/EmployeeAssets';
import Documents from './features/employee/EmployeeDocuments';
import EmployeeProfile from './features/profile/Profile';
import EditProfile from './features/profile/EditProfile';
import EmployeeComplain from './features/employee/EmployeeComplain';
import EmployeeRequest from './features/employee/EmployeeRequest';
import EmployeeHealthInsurance from './features/employee/EmployeeHealthInsurance';

// Team Lead Components
import { TeamLeadDashboard } from './features/teamLead/Dashboard';
import { TeamAttendance } from './features/teamLead/TeamAttendance';
import { TeamLeaveRequests } from './features/teamLead/TeamLeaveRequests';
import { TeamPerformance } from './features/teamLead/TeamPerformance';
import { TrainingAssignments } from './features/teamLead/TrainingAssignments';
import { AuthTest } from './features/auth/AuthTest';
import isBetween from "dayjs/plugin/isBetween";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import dayjs from 'dayjs';
dayjs.extend(isBetween);
dayjs.extend(weekday);
dayjs.extend(localeData);

const AppContent: React.FC = () => {
  const { isLoading } = useLoading();

  return (
    <>
      {isLoading && <PageLoader />}
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<RoleBasedRedirect />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Routes */}
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin', 'hr']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="attendance-leave" element={<AttendanceAndLeave />} />
            <Route path="reports" element={<ReportsAnalytics />} />
            <Route path="recruitment" element={<Recruitments />} />
            <Route path="performance" element={<PerformanceManagement />} />
            <Route path="training" element={<TrainingManagement />} />
            <Route path="documents" element={<DocumentManagement />} />
            <Route path="communication" element={<CommunicationAndNotification />} />
            <Route path="notifications" element={<NotificationManagement />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="profile/edit" element={<EditProfile />} />
          </Route>

          {/* Employee Routes */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="leave" element={<LeaveManagement />} />
            <Route path="training" element={<TrainingAndDevelopment />} />
            <Route path="payslip" element={<Payslip />} />
            <Route path="health-insurance" element={<EmployeeHealthInsurance />} />
            <Route path="assets" element={<Assets />} />
            <Route path="documents" element={<Documents />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="complain" element={<EmployeeComplain />} />
            <Route path="request" element={<EmployeeRequest />} />
          </Route>

          {/* Team Lead Routes */}
          <Route
            path="/team-lead"
            element={
              <ProtectedRoute allowedRoles={['team_lead']}>
                <TeamLeadLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TeamLeadDashboard />} />
            <Route path="attendance" element={<TeamAttendance />} />
            <Route path="leave-requests" element={<TeamLeaveRequests />} />
            <Route path="performance" element={<TeamPerformance />} />
            <Route path="training" element={<TrainingAssignments />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="profile/edit" element={<EditProfile />} />
          </Route>



          {/* Auth Test Route */}
          <Route
            path="/auth-test"
            element={
              <ProtectedRoute allowedRoles={['admin', 'hr', 'team_lead', 'employee']}>
                <AuthTest />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LoadingProvider>
          <AuthProvider>
            <GlobalStyles />
            <AppContent />
            {process.env.NODE_ENV === 'development'}
          </AuthProvider>
        </LoadingProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
